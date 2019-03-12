import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { Post } from './post.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postcount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsperpage: number, currentpage: number) {
    const queryparams = `?pagesize=${postsperpage}&page=${currentpage}`;
    this.http.get<{ message: string, posts: Post[], maxposts: number }>(BACKEND_URL + queryparams)
        .subscribe(transformedpostdata => {
           this.posts = transformedpostdata.posts;
           this.postsUpdated.next({ posts: [...this.posts], postcount: transformedpostdata.maxposts});
        });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string }>
    (BACKEND_URL + id );
  }

  addPost(title: string, content: string, image: File) {
    const postdata = new FormData();
    postdata.append('title', title);
    postdata.append('content', content);
    postdata.append('image', image, title);

    this.http.post<{message: string, post: Post }>(BACKEND_URL, postdata)
        .subscribe((responsedata) => {
          this.router.navigate(['/']);
        });
  }

  updatePost(_id: string, title: string, content: string, image: File | string) {
    let postdata: Post | FormData;
    if (typeof(image) === 'object') {
       postdata = new FormData();
       postdata.append('_id', _id);
       postdata.append('title', title);
       postdata.append('content', content);
       postdata.append('image', image, title);
    } else {
       postdata = {_id: _id, title: title, content: content, imagePath: image, creator: null};
    }
    this.http.put(BACKEND_URL + _id, postdata)
       .subscribe(response => {
         this.router.navigate(['/']);
       });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
