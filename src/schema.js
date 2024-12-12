const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const userTypeDef = require('./typedefs/usertypeDefs');
const babyInfoTypeDef = require('./typedefs/babyInfoTypeDef');
const userResolver = require('./resolvers/userresolvers');
const babyInfoResolver = require('./resolvers/babyInfoResolver');

const typeDefs = mergeTypeDefs([userTypeDef, babyInfoTypeDef]);
const resolvers = mergeResolvers([userResolver, babyInfoResolver]);

module.exports = { typeDefs, resolvers };
