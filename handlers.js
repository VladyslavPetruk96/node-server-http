const fs = require('fs');
const qs = require('querystring');
const comments = require('./data');

function getHome(req, res) {
	fs.readFile('./files/comment-form.html', (err, data) => {
		if (err) {
			res.statusCode = 500;
			res.setHeader('Content-Type', 'text/plain');
			res.end('server error while loading html file');
		} else {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/html');
			res.end(data);
		}
	});
}

function getHtml(req, res) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	res.write('<html><body><div>');
	res.write('<p>message to send user</p>');
	res.write('</div></body></html>');
	res.end();
}

function getText(req, res) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('plain text content type here');
}

function getComments(req, res) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(comments));
}

function postComments(req, res) {
	res.setHeader('Content-Type', 'text/plain');

	if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
		let body = '';
		req.on('data', chunk => {
			body += chunk.toString();
		});
		req.on('end', () => {
			try {
				const { id, ...comment } = qs.parse(body);
				comments.push({ id: Number(id), ...comment });
				res.statusCode = 200;
				res.setHeader('Content-Type', 'text/html');
				res.write('<h1>Comment data was received</h1>');
				res.write('<a href="/">Submit one more comment</a>');
				res.end();
			} catch (error) {
				res.statusCode = 400;
				res.end('Invalid Form data');
			}
		});
	} else if (req.headers['content-type'] === 'application/json') {
		let userComment = '';
		req.on('data', chunk => (userComment += chunk));
		req.on('end', () => {
			try {
				comments.push(JSON.parse(userComment));
				res.statusCode = 200;
				res.end('comment data was received');
			} catch (error) {
				res.statusCode = 400;
				res.end('Invalid JSON');
			}
		});
	} else {
		res.statusCode = 400;
		res.end('Data must be in the JSON format or as form');
	}
}

function handleNotFound(req, res) {
	res.statusCode = 404;
	res.setHeader('Content-Type', 'text/html');
	res.end('<h1>Page not found</h1>');
}

module.exports = {
	getHtml,
	getText,
	getComments,
	postComments,
	handleNotFound,
	getHome,
};
