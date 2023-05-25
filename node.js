const services = require('backend-api-services');
const config = require('config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
const lodash = require('lodash');

//Handler for calculate photo trend rating
exports.handler = async (event, context, callback) => {
	try {
		return await calculatePhotoTrendRating(event);
	} catch (error) {

		context.fail(JSON.stringify(error));
	}
};

//Function for calculate photo trend rating
async function calculatePhotoTrendRating() {
	services.logger.exectionStart('Delete photo trend rating from DB');
	await _deleteAllTrendRating();
	services.logger.exectionStop('Delete photo trend rating from DB');

	services.logger.exectionStart('Read from DB');
	const TrendedRatingData = await _getPhotoTrendRating();
	const TrendedData = await _getEventTrendRating();
	services.logger.exectionStop('Read from DB');
	const Trend = lodash.concat(TrendedRatingData, TrendedData);
	services.logger.exectionStart('Writing Trend Rating');
	await services.models
		.trendRating()
		.bulkCreate(Trend, {returning: true})
		.catch(error => {
			services.logger.print('Writing Trend Rating error' + error);
			return {
				statusCode: config.ERROR_RESPONSE,
				message: 'Something went wrong',
			};
		});
	services.logger.exectionStop('Writing Trend Rating');
	return true;
}

//Function to get photo trend rating
function _getPhotoTrendRating() {
	return services.models
		.photoTrend()
		.findAll({
			attributes: [
				[Sequelize.fn('min', Sequelize.col('trended_on')), 'trendedOn'],
				[Sequelize.literal('COUNT(photo_id)'), 'countOfPhotos'],
				'photoId',
			],
			where: {
				photo_id: [
					Sequelize.literal(
						'SELECT id from photos ORDER BY created_at DESC LIMIT ' +
							config.TREND_PHOTO_SIZE,
					),
				],
			},
			group: ['photo_id'],
			raw: true,
		})
		.then(photoTrends => {
			let trendLists = [];

			for (photoTrend of photoTrends) {
				const {photoId} = photoTrend;
				if (photoTrend && photoTrend.trendedOn) {
					const trendRating = _calculatePhotoTrendRating(photoTrend);
					trendLists.push({photoId: photoId, trendRating: trendRating});
				}
			}
			return trendLists;
		});
}

//Function to get event trend rating
function _getEventTrendRating() {
	return services.models
		.eventTrend()
		.findAll({
			attributes: [
				[Sequelize.fn('min', Sequelize.col('trended_on')), 'trendedOn'],
				[Sequelize.literal('COUNT(event_id)'), 'countOfEvents'],
				'eventId',
			],
			where: {
				event_id: [
					Sequelize.literal(
						'SELECT id from events ORDER BY created_at DESC LIMIT ' +
							config.TREND_PHOTO_SIZE,
					),
				],
			},
			group: ['event_id'],
			raw: true,
		})
		.then(eventTrends => {
			let trendLists = [];

			for (eventTrend of eventTrends) {
				const {eventId} = eventTrend;
				if (eventTrend && eventTrend.trendedOn) {
					const trendRating = _calculateEventTrendRating(eventTrend);
					trendLists.push({eventId: eventId, trendRating: trendRating});
				}
			}
			return trendLists;
		});
}

//Function to calculate photo trend rating
function _calculatePhotoTrendRating(photoTrend) {
	const startDate = moment(photoTrend.trendedOn, 'YYYY-MM-DD HH:mm:ss');
	const actualHours = moment.duration(moment().diff(startDate)).asHours();
	const photoHourAge = Math.round(actualHours);
	const trendRating =
		(photoTrend.countOfPhotos - 1) / Math.pow(photoHourAge + 2, config.GRAVITY);
	return trendRating;
}

//Function to calculate event trend rating
function _calculateEventTrendRating(eventTrend) {
	const startDate = moment(eventTrend.trendedOn, 'YYYY-MM-DD HH:mm:ss');
	const actualHours = moment.duration(moment().diff(startDate)).asHours();
	const photoHourAge = Math.round(actualHours);
	const trendRating =
		(eventTrend.countOfEvents - 1) / Math.pow(photoHourAge + 2, config.GRAVITY);
	return trendRating;
}
//Function to Delete all the records from trend rating table
async function _deleteAllTrendRating() {
	return services.models.trendRating().destroy({where: {}, truncate: true});
}
