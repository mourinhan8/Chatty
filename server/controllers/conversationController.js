const ErrorResponse = require("../core/errorResponse");
const db = require("../models");
const models = db.models;
const Op = db.Sequelize.Op;

module.exports.singleConversation = async (req, res, next) => {
  const { from, to } = req.body;
  try {
    const [user, user2] = await Promise.all([models.User.findByPk(from), models.User.findByPk(to)]);
    if (!user2) {
      throw new ErrorResponse("User 2 not found", 400);
    }
    let conversation = (await user.getConversations({
      where: {
        type: "single",
      },
      include: [
        {
          model: models.User,
          where: { id: to }
        }
      ],
    }))[0];

    if (!conversation) {
      conversation = await db.sequelize.transaction(async (t) => {
        const conversation = await models.Conversation.create({}, { transaction: t });

        await conversation.addUsers([user, user2], { transaction: t });

        return conversation;
      });
    }

    return res.json({
      convId: conversation.id
    });

  } catch (err) {
    next(err);
  }
};

module.exports.getAllGroup = async (req, res, next) => {
  const { userId } = req.body;
  try {
    const user = await models.User.findByPk(userId);
    return res.json({
      convs: await user.getConversations({
        where: {
          type: 'group'
        }
      })
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getGroup = async (req, res, next) => {
  const { userId, convId } = req.body;
  try {
    const userConversation = await models.UserConversation.findOne({
      where: {
        userId,
        convId
      }
    });
    if (!userConversation) {
      throw new ErrorResponse("User hasn't been in conversation", 400);
    }
    const convData = await models.Conversation.findOne({
      where: {
        id: convId,
        type: "group",
      }
    });
    if (!convData) {
      throw new ErrorResponse('Group not exist', 400);
    }
    let users = (await convData.getUsers()).map((user) => {
      const { password, UserConversation, ...data } = user.toJSON();
      return data;
    });
    return res.json({
      convData: convData.toJSON(),
      users,
    });
  } catch (err) {
    next(err);
  }

};

module.exports.groupConversation = async (req, res, next) => {
  let { userId, name, participants } = req.body;
  try {
    participants = Array.from(new Set(participants));
    const users = await models.User.findAll({
      where: {
        id: [userId, ...participants]
      },
    });

    if (users.length < participants.length + 1) {
      throw new ErrorResponse("User not found", 400);
    }
    const conversation = await db.sequelize.transaction(async (t) => {
      const participantsName = await Promise.all(participants.map(async (id) => {
        const userData = await models.User.findByPk(id);
        return userData.username;
      }));

      const conversation = await models.Conversation.create({
        type: "group",
        name: name || participantsName.join(", ")
      },
        { transaction: t });

      await conversation.addUsers(users, { transaction: t });

      return conversation;
    });

    return res.json({
      convId: conversation.id
    });
  } catch (err) {
    next(err);
  }
};

module.exports.addUserToConversation = async (req, res, next) => {
  let { userId, convId, participants } = req.body;
  try {
    participants = Array.from(new Set(participants));

    const users = await models.User.findAll({
      where: {
        id: [...participants]
      },
    });

    if (users.length < participants.length) {
      throw new ErrorResponse("User not found", 400);
    }
    const checkUserInConv = await models.UserConversation.findOne({
      where: {
        userId,
        convId
      }
    });
    if (!checkUserInConv) {
      throw new ErrorResponse("You are not in conversation");
    }
    const conversation = await db.sequelize.transaction(async (t) => {
      const conversation = await models.Conversation.findByPk(convId);
      await conversation.addUsers(users, { transaction: t });
      return conversation;
    });

    return res.json({
      convId: conversation.id
    });

  } catch (err) {
    next(err);
  }

}


