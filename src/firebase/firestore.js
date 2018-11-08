import {db} from './firebase';

  export async function addPost(post) {
      const postRef = db.collection('posts').add(post)
      return postRef
  }