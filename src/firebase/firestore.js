import {db} from './firebase';

export async function addPost(post) {
    const postRef = db
        .collection('posts')
        .add(post)
    return postRef
}
export async function addLikesForPic(like) {
    const likeRef = db
        .collection('likesForPic')
        .add(like);

}
export async function updateLikesForPic(like) {}
export async function getLikesForImage(post) {
    const likeRef = await db
        .collection('likesForPic')
        .where('imgURL', '==', post.imgUrl);
    console.log(likeRef);
    return likeRef;
}
export async function getPostForImgURL(imgUrl) {
    const imgRef = await db
        .collection('posts')
        .where('imgURL', '==', imgUrl);
    console.log(imgRef);
    return imgRef;
}
export async function deleteLikesForPic(imgUrl) {
    const likeRef = await db
        .collection('likesForPic')
        .where('imgURL', '==', imgUrl);
    return likeRef;
}