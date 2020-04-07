const Agent = require('./Agent');
const File = require('./File');
const Job = require('./Job');
const JobSample = require('./JobSample');
const SearchHistory = require('./SearchHistory');
const State = require('./State');
const Town = require('./Town');
const Worker = require('./Worker');
const Location= require('./Location');
const User = require('./User');


exports = Agent.hasOne(Location, {
	foreignKey: 'agent_id',
	as: 'location'
});
exports = Agent.hasOne(Worker, {
	foreignKey: 'agent_id',
	as: 'business'
});
exports = Agent.hasOne(User, {
	foreignKey: 'agent_id',
	as: 'profile'
});
exports = Agent.hasMany(Job, {
	foreignKey: 'user_id',
	as: 'user_jobs'
});
exports = Agent.hasMany(Job, {
	foreignKey: 'worker_id',
	as: 'worker_jobs'
});
exports = Agent.hasMany(SearchHistory, {
	foreignKey: 'agent_id',
	as: 'search_histories'
});



exports = File.belongsTo(JobSample, {
	foreignKey: 'job_sample_id',
	as: 'file'
});


exports = Job.belongsTo(Agent, {
	foreignKey: 'user_id',
	as: 'user_jobs'
});
exports = Job.belongsTo(Agent, {
	foreignKey: 'worker_id',
	as: 'worker_jobs'
});

exports = SearchHistory.belongsTo(Agent, {
	foreignKey: 'agent_id',
	as: 'search_history'
});

exports = State.hasMany(Town, {
	foreignKey: 'state_id',
	as: 'towns'
});
exports = State.hasMany(Location, {
	foreignKey: 'state_id',
	as: 'locations'
});

exports = Town.belongsTo(State, {
	foreignKey: 'state_id',
	as: 'towns'
});
exports = Town.hasMany(Location, {
	foreignKey: 'town_id',
	as: 'locations'
});


exports = JobSample.hasOne(File, {
	foreignKey: 'job_sample_id',
	as: 'file'
});
exports = JobSample.belongsTo(Worker, {
	foreignKey: 'worker_id',
	as: 'job_samples'
});

exports = Worker.belongsTo(Agent, {
	foreignKey: 'agent_id',
	as: 'profile'
});
exports = Worker.hasMany(JobSample, {
	foreignKey: 'worker_id',
	as: 'job_samples'
});

exports = User.belongsTo(Agent, {
	foreignKey: 'agent_id',
	as: 'agent'
});


exports = Location.belongsTo(Agent, {
	foreignKey: 'agent_id',
	as: 'location'
});
// exports = Location.hasMany(Agent, {
// 	foreignKey: 'agent_id',
// 	as: 'agents'
// });
exports = Location.belongsTo(State, {
	foreignKey: 'state_id',
	as: 'state'
});
exports = Location.belongsTo(Town, {
	foreignKey: 'town_id',
	as: 'town'
});


