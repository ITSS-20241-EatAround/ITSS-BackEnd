const { UserSearchHistory } = require('../models/config');
const token = require('../utils/TokenUtil');
const { getMethod } = require('../utils/ApiUtil');

exports.updateHistory = async (req, res) => {
    try {
        const user_id = token(req).id;
        const {data} = req.body;
        for (var item of data) {
            const exst = await UserSearchHistory.findOne({ where: { dish_id: item.dish_id } });
            if (exst) {
                exst.search_count++;
                await exst.save();
            } else {
                await UserSearchHistory.create({
                    user_id,
                    dish_id: item.dish_id,
                    search_count : 1
                });
            }
        }
        return res.status(200).json({message : 'Success'});
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

exports.getByUserId = async (req, res) => {
    try {
        const user_id = token(req).id;
        
        const data = await UserSearchHistory.findAll({ where: { user_id}});
        return res.status(200).json({
            status : true,
            data
        });
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}