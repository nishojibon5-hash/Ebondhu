import { RequestHandler } from "express";
import {
  appendRow,
  findRows,
  getRows,
  updateRow,
  SHEET_NAMES,
  findRow,
} from "../services/sheets";
import crypto from "crypto";

// ============ ADS MANAGEMENT ============

export const handleCreateAd: RequestHandler = async (req, res) => {
  try {
    const {
      advertiserPhone,
      title,
      description,
      image,
      category,
      dailyBudget,
      pricePerMille,
    } = req.body;

    if (!advertiserPhone || !title || !description || !image) {
      return res.status(400).json({
        ok: false,
        error: "বিজ্ঞাপনের তথ্য অসম্পূর্ণ",
      });
    }

    // Check advertiser's balance
    const user = await findRow(SHEET_NAMES.USERS, "phone", advertiserPhone);
    if (!user) {
      return res.status(404).json({
        ok: false,
        error: "ব্যবহারকারী পাওয়া যায়নি",
      });
    }

    const adId = crypto.randomUUID();
    const now = new Date().toISOString();

    const adData = [
      adId,
      advertiserPhone,
      title,
      description,
      image,
      "",
      category || "সাধারণ",
      dailyBudget || "0",
      pricePerMille || "10",
      "সক্রিয়",
      "0",
      "0",
      now,
      now,
    ];

    await appendRow(SHEET_NAMES.ADVERTISEMENTS, adData);

    res.status(201).json({
      ok: true,
      ad: {
        id: adId,
        advertiserPhone,
        title,
        description,
        image,
        category,
        dailyBudget,
        pricePerMille,
        status: "সক্রিয়",
        impressions: 0,
        clicks: 0,
        createdAt: now,
      },
    });
  } catch (error) {
    console.error("Create ad error:", error);
    res.status(500).json({
      ok: false,
      error: "বিজ্ঞাপন তৈরিতে ত্রুটি",
    });
  }
};

export const handleGetAdvertiserAds: RequestHandler = async (req, res) => {
  try {
    const { advertiserPhone } = req.params;

    const ads = await findRows(
      SHEET_NAMES.ADVERTISEMENTS,
      "advertiserPhone",
      advertiserPhone,
    );

    const formattedAds = ads.map((ad) => ({
      id: ad.id,
      advertiserPhone: ad.advertiserPhone,
      title: ad.title,
      description: ad.description,
      image: ad.image,
      category: ad.category,
      dailyBudget: ad.dailyBudget || "0",
      pricePerMille: ad.pricePerMille || "10",
      status: ad.status,
      impressions: parseInt(ad.impressions || "0"),
      clicks: parseInt(ad.clicks || "0"),
      createdAt: ad.createdAt,
      updatedAt: ad.updatedAt,
    }));

    res.json({
      ok: true,
      ads: formattedAds,
    });
  } catch (error) {
    console.error("Get advertiser ads error:", error);
    res.status(500).json({
      ok: false,
      error: "বিজ্ঞাপন আনতে ব্যর্থ",
    });
  }
};

export const handleGetFeedAds: RequestHandler = async (req, res) => {
  try {
    const { userPhone } = req.query;

    // Get user's monetization settings
    const userSettings = userPhone
      ? await findRow(SHEET_NAMES.USER_AD_SETTINGS, "userPhone", userPhone as string)
      : null;

    if (!userSettings || userSettings.contentMonetizeEnabled !== "সক্রিয়") {
      return res.json({
        ok: true,
        ads: [],
      });
    }

    // Get all active ads, sorted by impressions (show newer/less shown ads first)
    const ads = await getRows(SHEET_NAMES.ADVERTISEMENTS);
    const activeAds = ads
      .filter((ad) => ad.status === "সক্রিয়")
      .sort(
        (a, b) =>
          parseInt(a.impressions || "0") - parseInt(b.impressions || "0"),
      )
      .slice(0, 5)
      .map((ad) => ({
        id: ad.id,
        advertiserPhone: ad.advertiserPhone,
        title: ad.title,
        description: ad.description,
        image: ad.image,
        category: ad.category,
        pricePerMille: ad.pricePerMille || "10",
        impressions: parseInt(ad.impressions || "0"),
        clicks: parseInt(ad.clicks || "0"),
      }));

    res.json({
      ok: true,
      ads: activeAds,
    });
  } catch (error) {
    console.error("Get feed ads error:", error);
    res.status(500).json({
      ok: false,
      error: "বিজ্ঞাপন আনতে ব্যর্থ",
    });
  }
};

export const handleLogAdImpression: RequestHandler = async (req, res) => {
  try {
    const { adId, userPhone } = req.body;

    if (!adId || !userPhone) {
      return res.status(400).json({
        ok: false,
        error: "বিজ্ঞাপন আইডি এবং ব্যবহারকারী ফোন প্রয়োজন",
      });
    }

    // Log impression
    const impressionId = crypto.randomUUID();
    const now = new Date().toISOString();
    const impressionData = [impressionId, adId, userPhone, now];
    await appendRow(SHEET_NAMES.AD_IMPRESSIONS, impressionData);

    // Update ad impression count
    const ads = await getRows(SHEET_NAMES.ADVERTISEMENTS);
    const adIndex = ads.findIndex((a) => a.id === adId);

    if (adIndex !== -1) {
      const ad = ads[adIndex];
      const currentImpressions = parseInt(ad.impressions || "0");
      const newImpressions = (currentImpressions + 1).toString();
      const pricePerMille = parseInt(ad.pricePerMille || "10");

      // Calculate cost (price per 1000 impressions)
      const costInPaisa = (pricePerMille * 100) / 1000; // Convert to paisa

      // Deduct from advertiser's balance
      const advertiser = await findRow(
        SHEET_NAMES.USERS,
        "phone",
        ad.advertiserPhone,
      );
      if (advertiser) {
        const currentBalance = parseFloat(advertiser.balance || "0");
        const newBalance = Math.max(0, currentBalance - costInPaisa / 100); // Convert back to taka

        const updatedAdvertiser = [
          advertiser.phone,
          advertiser.name,
          advertiser.email,
          advertiser.photo,
          newBalance.toString(),
          advertiser.nid,
          advertiser.bankAccount,
          advertiser.createdAt,
          new Date().toISOString(),
        ];

        const advertiserIndex = ads.findIndex(
          (a) => a.id === adId,
        );
        // Actually we need to find in USERS table, not ADVERTISEMENTS
        const allUsers = await getRows(SHEET_NAMES.USERS);
        const userIndex = allUsers.findIndex(
          (u) => u.phone === ad.advertiserPhone,
        );
        if (userIndex !== -1) {
          await updateRow(SHEET_NAMES.USERS, userIndex, updatedAdvertiser);
        }
      }

      // Update ad
      const updatedAd = [
        ad.id,
        ad.advertiserPhone,
        ad.title,
        ad.description,
        ad.image,
        ad.videoUrl || "",
        ad.category,
        ad.dailyBudget,
        ad.pricePerMille,
        ad.status,
        newImpressions,
        ad.clicks || "0",
        ad.createdAt,
        new Date().toISOString(),
      ];

      await updateRow(SHEET_NAMES.ADVERTISEMENTS, adIndex, updatedAd);
    }

    res.json({
      ok: true,
      message: "ইম্প্রেশন রেকর্ড করা হয়েছে",
    });
  } catch (error) {
    console.error("Log ad impression error:", error);
    res.status(500).json({
      ok: false,
      error: "ইম্প্রেশন রেকর্ড করতে ব্যর্থ",
    });
  }
};

export const handleLogAdClick: RequestHandler = async (req, res) => {
  try {
    const { adId, userPhone } = req.body;

    if (!adId || !userPhone) {
      return res.status(400).json({
        ok: false,
        error: "বিজ্ঞাপন আইডি এবং ব্যবহারকারী ফোন প্রয়োজন",
      });
    }

    // Log click
    const clickId = crypto.randomUUID();
    const now = new Date().toISOString();
    const clickData = [clickId, adId, userPhone, now];
    await appendRow(SHEET_NAMES.AD_CLICKS, clickData);

    // Update ad click count
    const ads = await getRows(SHEET_NAMES.ADVERTISEMENTS);
    const adIndex = ads.findIndex((a) => a.id === adId);

    if (adIndex !== -1) {
      const ad = ads[adIndex];
      const currentClicks = parseInt(ad.clicks || "0");
      const newClicks = (currentClicks + 1).toString();

      const updatedAd = [
        ad.id,
        ad.advertiserPhone,
        ad.title,
        ad.description,
        ad.image,
        ad.videoUrl || "",
        ad.category,
        ad.dailyBudget,
        ad.pricePerMille,
        ad.status,
        ad.impressions || "0",
        newClicks,
        ad.createdAt,
        new Date().toISOString(),
      ];

      await updateRow(SHEET_NAMES.ADVERTISEMENTS, adIndex, updatedAd);
    }

    res.json({
      ok: true,
      message: "ক্লিক রেকর্ড করা হয়েছে",
    });
  } catch (error) {
    console.error("Log ad click error:", error);
    res.status(500).json({
      ok: false,
      error: "ক্লিক রেকর্ড করতে ব্যর্থ",
    });
  }
};

export const handleUpdateAdStatus: RequestHandler = async (req, res) => {
  try {
    const { adId, status } = req.body;

    if (!adId || !status) {
      return res.status(400).json({
        ok: false,
        error: "বিজ্ঞাপন আইডি এবং স্ট্যাটাস প্রয়োজন",
      });
    }

    const ads = await getRows(SHEET_NAMES.ADVERTISEMENTS);
    const adIndex = ads.findIndex((a) => a.id === adId);

    if (adIndex === -1) {
      return res.status(404).json({
        ok: false,
        error: "বিজ্ঞাপন পাওয়া যায়নি",
      });
    }

    const ad = ads[adIndex];
    const updatedAd = [
      ad.id,
      ad.advertiserPhone,
      ad.title,
      ad.description,
      ad.image,
      ad.videoUrl || "",
      ad.category,
      ad.dailyBudget,
      ad.pricePerMille,
      status,
      ad.impressions || "0",
      ad.clicks || "0",
      ad.createdAt,
      new Date().toISOString(),
    ];

    await updateRow(SHEET_NAMES.ADVERTISEMENTS, adIndex, updatedAd);

    res.json({
      ok: true,
      message: "বিজ্ঞাপন আপডেট করা হয়েছে",
    });
  } catch (error) {
    console.error("Update ad status error:", error);
    res.status(500).json({
      ok: false,
      error: "বিজ্ঞাপন আপডেট করতে ব্যর্থ",
    });
  }
};

// ============ USER AD SETTINGS ============

export const handleUpdateMonetizeSettings: RequestHandler = async (req, res) => {
  try {
    const { userPhone, contentMonetizeEnabled } = req.body;

    if (!userPhone) {
      return res.status(400).json({
        ok: false,
        error: "ব্যবহারকারী ফোন প্রয়োজন",
      });
    }

    const settings = await findRow(
      SHEET_NAMES.USER_AD_SETTINGS,
      "userPhone",
      userPhone,
    );

    const now = new Date().toISOString();

    if (settings) {
      // Update existing
      const allSettings = await getRows(SHEET_NAMES.USER_AD_SETTINGS);
      const settingIndex = allSettings.findIndex(
        (s) => s.userPhone === userPhone,
      );

      if (settingIndex !== -1) {
        const updatedSettings = [
          userPhone,
          contentMonetizeEnabled === true ? "সক্রিয়" : "নিষ্ক্রিয়",
          settings.createdAt,
          now,
        ];
        await updateRow(
          SHEET_NAMES.USER_AD_SETTINGS,
          settingIndex,
          updatedSettings,
        );
      }
    } else {
      // Create new
      const settingsData = [
        userPhone,
        contentMonetizeEnabled === true ? "সক্রিয়" : "নিষ্ক্রিয়",
        now,
        now,
      ];
      await appendRow(SHEET_NAMES.USER_AD_SETTINGS, settingsData);
    }

    res.json({
      ok: true,
      message: "সেটিংস আপডেট করা হয়েছে",
    });
  } catch (error) {
    console.error("Update monetize settings error:", error);
    res.status(500).json({
      ok: false,
      error: "সেটিংস আপডেট করতে ব্যর্থ",
    });
  }
};

export const handleGetMonetizeSettings: RequestHandler = async (req, res) => {
  try {
    const { userPhone } = req.params;

    const settings = await findRow(
      SHEET_NAMES.USER_AD_SETTINGS,
      "userPhone",
      userPhone,
    );

    if (!settings) {
      return res.json({
        ok: true,
        settings: {
          userPhone,
          contentMonetizeEnabled: false,
          createdAt: new Date().toISOString(),
        },
      });
    }

    res.json({
      ok: true,
      settings: {
        userPhone: settings.userPhone,
        contentMonetizeEnabled: settings.contentMonetizeEnabled === "সক্রিয়",
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get monetize settings error:", error);
    res.status(500).json({
      ok: false,
      error: "সেটিংস আনতে ব্যর্থ",
    });
  }
};
