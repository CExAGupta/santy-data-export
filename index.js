const axios = require('axios');
const fs = require('fs');
/**
 *write comments to file
 *
 * @param {*} postId
 * @param {*} comment
 */
async function writeCommentToFile(postId, comment) {
	await fs.mkdirSync(`posts/${postId}/comments/${comment.id}`, { recursive: true });
	await fs.writeFileSync(`posts/${postId}/comments/${comment.id}/comment.json`, JSON.stringify(comment));
}
/**
 *retrieve posts for a post 
 *
 * @param {Post} { id: postId = null } post data
 * @return {Promise<void>} 
 */
async function retrieveComments({ id: postId = null }) {
	if (!postId) return;
	const response = await axios.get(`https://rossvideo.zendesk.com/api/v2/help_center/community/posts/${postId}/comments`);
	const { comments = [], next_page } = response.data;
	console.log(`${comments.length} comments loaded for ${postId}...`);

	for (const comment of comments) {
		await writeCommentToFile(postId, comment);
	}
	if (next_page) {
		await fetchAllPosts(next_page);
	}
}
async function writePostToFile(post) {
	await fs.mkdirSync(`posts/${post.id}`, { recursive: true });
	await fs.writeFileSync(`posts/${post.id}/post.json`, JSON.stringify(post));
}
async function fetchAllPosts(url) {
	const response = await axios.get(url);
	const { posts = [], next_page } = response.data;
	console.log(`${posts.length} posts loaded...`);
	for (const post of posts) {
		await writePostToFile(post);
		await retrieveComments(post)
	}
	if (next_page) {
		await fetchAllPosts(next_page);
	}
}
fs.rmdir('posts', {recursive: true}, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	fetchAllPosts('https://rossvideo.zendesk.com/api/v2/help_center/community/posts.json?page=1&per_page=100').then(() => {
		console.log('pages loaded');
		process.exit(0);
	}).catch((err) => {
		console.error(err);
		process.exit(1);
	})
})

