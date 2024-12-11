const { DishComment } = require('../models/config');
const token = require('../utils/TokenUtil');
const { putMethod, getMethod } = require('../utils/ApiUtil');

const calculateDishAverageRate = async (req, dish_id) => {
    const { count, rows } = await DishComment.findAndCountAll({
        where: { dish_id },
        attributes: ['dish_rate'],
    });

    const totalRate = rows.reduce((sum, comment) => sum + (+comment.dish_rate || 0), 2.5);
    const averageRate = count > 0 ? totalRate / (count + 1) : 2.5;
    
    const {restaurant_id} = await getMethod(req, '/dish/get-by-id/'+dish_id);
    
    await putMethod(req, '/restaurant/'+restaurant_id, {rate : averageRate});
}

const DishCommentController = {
    async getCommentsByDishId(req, res) {
        try {
            const { id } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const { count, rows } = await DishComment.findAndCountAll({
                where: { dish_id: id },
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset),
            });

            res.status(200).json({
                total: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                data: rows,
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch comments', details: error.message });
        }
    },

    async createComment(req, res) {
        try {
            const user_id = token(req).id;
            const { dish_id, comment_content, dish_rate } = req.body;
            const newComment = await DishComment.create({
                dish_id,
                user_id,
                comment_content,
                dish_rate
            });
            await calculateDishAverageRate(req, dish_id);
            res.status(201).json(newComment);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create comment', details: error.message });
        }
    },

    async updateComment(req, res) {
        try {
            const { id } = req.params;
            const { comment_content, dish_rate } = req.body;
            const updated = await DishComment.findOne(
                { where: { comment_id: id } }
            );

            if (!updated) {
                return res.status(404).json({ error: 'Comment not found' });
            }
            updated.comment_content = comment_content;
            updated.dish_rate = dish_rate;
            await updated.save();
            await calculateDishAverageRate(req, updated.dish_id);
            res.status(200).json({ message: 'Comment updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update comment', details: error.message });
        }
    },

    async deleteComment(req, res) {
        try {
            const { id } = req.params;
            const {dish_id} = await DishComment.findByPk(id);
            const deleted = await DishComment.destroy({ where: { comment_id: id } });

            if (deleted === 0) {
                return res.status(404).json({ error: 'Comment not found' });
            }
            await calculateDishAverageRate(req, dish_id);
            res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete comment', details: error.message });
        }
    }
};


module.exports = DishCommentController;
