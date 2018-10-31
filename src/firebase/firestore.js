import {db} from './firebase';

  export async function addDb(post) {
      const postRef = db.collection('posts').add(post)
      return postRef
  }