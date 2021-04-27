const express = require('express');
const router = express.Router();
const xss = require('xss');
const commentData = require('../data/comment'); 

let { ObjectId } = require('mongodb');

router.post('/comment/new', async (req, res) => {   
    let errors = [];
    let userId = req.session.user._id;
    let postId = xss(req.body.postId.trim());
    let comment = xss(req.body.comment.trim());
    
    if (!req.session.user) errors.push('Must log in to comment.');
    if(!userId) errors.push('Please provide userId');
    if(!postId) errors.push('Please provide post id');
    if(!comment) errors.push('Please provide comment');
    if(typeof userId !== 'string') errors.push('Invalid comment userid');
    if(typeof postId !== 'string') errors.push('Invalid comment postid');
    if(typeof comment !== 'string') errors.push('Please provide proper type');
 

    if (errors.length > 0) {
        res.status(500).json({
            success: false,
            errors: errors,
            message: 'Errors encountered'
        });
    }

    try {
        const commentInfo = await commentData.createComment(userId, postId, comment);
        let commentLayout = {
            comment: commentInfo.comment
        };
        res.render('partials/comment_info', { layout: null, ...commentLayout});
    } catch (e) {
        errors.push(e);
        res.status(500).json({
            success: false,
            errors: errors
        });
    }
});


module.exports = router;