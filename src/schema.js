const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const userTypeDef = require('./typedefs/usertypeDefs');
const userResolver = require('./resolvers/userresolvers');
const babyInfoTypeDef = require('./typedefs/babyInfoTypeDef');
const babyInfoResolver = require('./resolvers/babyInfoResolver');
const feedTypeDef = require('./typedefs/feedingTypeDef');
const diaperTypeDef = require('./typedefs/diaperTypeDef');
const sleepTypeDef = require('./typedefs/sleepTypeDef');
const growthTypeDef = require('./typedefs/growthTypeDef');
const feedResolver = require('./resolvers/feedingResolver');
const diaperResolver = require('./resolvers/diaperResolver');
const sleepResolver = require('./resolvers/sleepResolver');
const growthResolver = require('./resolvers/growthResolver');


const typeDefs = mergeTypeDefs([userTypeDef, babyInfoTypeDef,feedTypeDef,diaperTypeDef,sleepTypeDef,growthTypeDef]);
const resolvers = mergeResolvers([userResolver, babyInfoResolver,feedResolver,diaperResolver,sleepResolver,growthResolver]);

module.exports = { typeDefs, resolvers };
