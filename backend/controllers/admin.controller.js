import User from "../models/user.model.js";
import Store from "../models/store.model.js";
import Rating from "../models/rating.model.js";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

export const getDashboardData = async (req, res) => {
  try {
    const users = await User.count();
    const stores = await Store.count();
    const ratings = await Rating.count();

    res.status(200).json({ users, stores, ratings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      attributes: { exclude: ["password"] },
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllStores = async (req, res) => {
  try {
    const { name, email, address } = req.query;

    const storeWhere = {};
    if (name) storeWhere.name = { [Op.like]: `%${name}%` };
    if (address) storeWhere.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({ where: storeWhere });

    // Get average ratings per store
    const storeIds = stores.map((s) => s.id);
    const ratings = await Rating.findAll({
      where: { storeId: storeIds },
    });

    const storesWithRatings = stores.map((store) => {
      const storeRatings = ratings.filter((r) => r.storeId === store.id);
      const avg =
        storeRatings.length > 0
          ? (
              storeRatings.reduce((sum, r) => sum + r.rating, 0) /
              storeRatings.length
            ).toFixed(1)
          : null;

      // Get owner email
      return {
        ...store.toJSON(),
        averageRating: avg,
        ratingCount: storeRatings.length,
      };
    });

    // Filter by email (owner email) if needed
    if (email) {
      const owners = await User.findAll({
        where: { email: { [Op.like]: `%${email}%` }, role: "owner" },
        attributes: ["id", "email"],
      });
      const ownerIds = owners.map((o) => o.id);
      const filtered = storesWithRatings.filter((s) =>
        ownerIds.includes(s.ownerId)
      );
      return res.status(200).json(filtered);
    }

    res.status(200).json(storesWithRatings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: role || "user",
    });
    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.status(201).json({ message: "User created successfully", user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addStore = async (req, res) => {
  try {
    const { name, address, description, ownerEmail } = req.body;

    // Find owner by email
    let ownerId = null;
    if (ownerEmail) {
      const owner = await User.findOne({ where: { email: ownerEmail, role: "owner" } });
      if (!owner) {
        return res.status(404).json({ message: "Store owner not found with that email" });
      }
      ownerId = owner.id;
    } else {
      return res.status(400).json({ message: "Owner email is required" });
    }

    const store = await Store.create({ name, address, description, ownerId });
    res.status(201).json({ message: "Store created successfully", store });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};