import Store from "../models/store.model.js";
import Rating from "../models/rating.model.js";
import User from "../models/user.model.js";

export const createStore = async (req, res) => {
  try {
    const { name, address, description, ownerId } = req.body;

    const store = await Store.create({
      name,
      address,
      description,
      ownerId,
    });

    res.status(201).json({
      message: "Store created successfully",
      store,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll();

    // Get all ratings for these stores
    const storeIds = stores.map((s) => s.id);
    const ratings = await Rating.findAll({ where: { storeId: storeIds } });

    const storesWithRatings = stores.map((store) => {
      const storeRatings = ratings.filter((r) => r.storeId === store.id);
      const avg =
        storeRatings.length > 0
          ? (
              storeRatings.reduce((sum, r) => sum + r.rating, 0) /
              storeRatings.length
            ).toFixed(1)
          : null;
      return { ...store.toJSON(), averageRating: avg, ratingCount: storeRatings.length };
    });

    res.status(200).json({ stores: storesWithRatings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOwnerStores = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const stores = await Store.findAll({ where: { ownerId } });
    const storeIds = stores.map((store) => store.id);

    const ratings = await Rating.findAll({ where: { storeId: storeIds } });

    // Get users who rated
    const userIds = [...new Set(ratings.map((r) => r.userId))];
    const users = await User.findAll({
      where: { id: userIds },
      attributes: { exclude: ["password"] },
    });

    // Calculate average per store
    const storesData = stores.map((store) => {
      const storeRatings = ratings.filter((r) => r.storeId === store.id);
      const avg =
        storeRatings.length > 0
          ? (
              storeRatings.reduce((sum, r) => sum + r.rating, 0) /
              storeRatings.length
            ).toFixed(1)
          : null;

      const raters = storeRatings.map((r) => {
        const user = users.find((u) => u.id === r.userId);
        return {
          userId: r.userId,
          rating: r.rating,
          name: user ? user.name : "Unknown",
          email: user ? user.email : "Unknown",
        };
      });

      return { ...store.toJSON(), averageRating: avg, raters };
    });

    res.status(200).json({ stores: storesData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    const ratings = await Rating.findAll({ where: { userId } });
    res.status(200).json({ ratings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};