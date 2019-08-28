import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Notification from '../models/schemas/Notification';
import Appointment from '../models/Appointment';
import User from '../models/User';

class NotificationController {
    async index(req, res) {
        const checkUserProvider = await User.findOne({
            where: {
                id: req.userId,
                provider: true,
            },
        });

        if (!checkUserProvider) {
            return res
                .status(401)
                .json({ error: 'Only provider can load notifications' });
        }

        const notifications = await Notification.find({
            user: req.userId,
        })
            .sort({ createdAt: 'desc' })
            .limit(20);

        return res.json(notifications);
    }

    async update(req, res) {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            {
                read: true,
            },
            {
                new: true,
            }
        );

        return res.json(notification);
    }
}

export default new NotificationController();
