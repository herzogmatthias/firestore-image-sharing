import {db, firestore} from './firebase';

export async function addPost(post) {
    const postRef = db
        .collection('posts')
        .add(post)
    return postRef
}
export async function addLikesForPic(like) {
    db
        .collection('likesForPic')
        .add(like);

}
export async function updateLikesForPic(like, user) {
    const likeRef = await db
        .collection("likesForPic")
        .where("imgURL", "==", like.imgURL)
        .get();
    likeRef.forEach(async doc => {
        const updateRef = await doc
            .ref
            .update({
                "users": firestore
                    .FieldValue
                    .arrayUnion(user),
                "likeCount": like.likeCount + 1
            })
    });
}
export async function getLikesForImage(post) {
    const likeRef = await db
        .collection('likesForPic')
        .where('imgURL', '==', post.imgURL);
    return likeRef;
}
export async function getPostForId(id) {
    const imgRef = await db
        .collection('posts')
        .doc(id);
    return imgRef;
}
export async function deleteLikesForPic(imgUrl) {
    const likeRef = await db
        .collection('likesForPic')
        .where('imgURL', '==', imgUrl);
    return likeRef;
}
export async function deleteCommentsForPic(postId) {
    const commentRef = await db.collection('commentsForPicture').where('postId', '==', postId);
    return commentRef;
}
export async function addCommentsForPicture(comment) {
    db
        .collection('commentsForPicture')
        .add(comment);
}
export async function addMessagingToken(token) {
    db.collection('messagingTokens').add(token);
}
export async function checkForToken(token) {
    return await db.collection('messagingTokens').where('uid', "==", token.uid).get();
}
export async function getTokenForUid(uid) {
    const tokenRef = await db.collection('messagingTokens').where('uid', '==', uid).get();
    return tokenRef;
}
export async function updateTokenForUid(token, newId) {
    const tokenRef = await db.collection('messagingTokens').where('uid', '==', token.uid).get();
    await tokenRef.docs.forEach(doc => doc.ref.update({id: newId}));
}