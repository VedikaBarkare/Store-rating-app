import Rating from "../models/rating.model.js";

export const addRating = async (req, res) => {

  try {

    const { rating, storeId } = req.body;

    const userId = req.user.id;

    const existingRating = await Rating.findOne({
      where: {
        userId,
        storeId
      }
    });

    if (existingRating) {

      existingRating.rating = rating;

      await existingRating.save();

      return res.status(200).json({
        message: "Rating updated successfully",
        rating: existingRating,
      });

    }

    const newRating = await Rating.create({
      rating,
      userId,
      storeId,
    });

    res.status(201).json({
      message: "Rating added successfully",
      rating: newRating,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};