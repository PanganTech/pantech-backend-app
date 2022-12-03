const { repositories } = require('data-access-utility');
const { helpers, configs } = require('backend-utility');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const connection = require('../db');
const { DailyQuest } = configs.enums;
const { isValid, isValidArray } = helpers.functions;


const generateLoginReward = async (userId, transaction = null) => {
    let TODAY_START = new Date(Date.now()).setHours(0, 0, 0, 0);
    let NOW = new Date(Date.now());
    TODAY_START = moment.parseZone(TODAY_START).utc(true).format();
    // let TODAY_START = moment().subtract(5, 'minutes');
    TODAY_START = moment(TODAY_START).utcOffset('+05').format();
    NOW = moment(NOW).utcOffset('+05').format();
    let questInfo = null;
    let userDailyLogin = null;
    let userDailyQuestCreated = null;
    console.log(`************************ TODAY_START: ${TODAY_START}  -->  NOW: ${NOW} ***********************`)

    const DailyQuestRepo = new repositories.DailyQuest(connection);
    const UserDailyQuest = new repositories.UserDailyQuest(connection);
    const QuestingRewards = new repositories.QuestingRewards(connection);

    questInfo = await DailyQuestRepo.getByCriteria(null, null, DailyQuest.DAILY_LOGIN);
    questInfo = questInfo.toJSON();

    if(isValid(questInfo) === true){
        userDailyLogin = await UserDailyQuest.getUserDailyQuestsDaily(userId, questInfo.id, TODAY_START, NOW);
        console.log({userDailyLogin})
    }

    if(isValid(userDailyLogin) === false || isValidArray(userDailyLogin) === false){
        userDailyQuestCreated = await UserDailyQuest.create(uuidv4(), userId, questInfo.id);
    }

    if(isValid(userDailyQuestCreated) === true){
        userDailyQuestCreated = await QuestingRewards.create(uuidv4(), userId, questInfo.axp_point, questInfo.seeds, questInfo.id);
    }
}

module.exports = {
    generateLoginReward
}