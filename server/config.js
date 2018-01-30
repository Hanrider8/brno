export default {
  PORT: process.env.PORT || 3001,
  MONGO_URL:
    process.env.MONGO_URL || 'mongodb://root:root@ds219318.mlab.com:19318/brno',
  ENDPOINT_URL: '/graphql',
  FETCH_INTERVAL_IN_SECONDS: 3600,
}
