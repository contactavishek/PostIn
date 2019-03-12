import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

import { Post } from '../post.model';
import { PostsService} from '../posts.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading = false;
  totalposts = 0;
  postsperpage = 2;
  currentpage = 1;
  pagesizeoptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private postssub: Subscription;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsperpage, this.currentpage);
    this.userId = this.authService.getUserId();
    this.postssub = this.postsService.getPostUpdateListener()
    .subscribe((postdata: { posts: Post[], postcount: number }) => {
      this.isLoading = false;
      this.totalposts = postdata.postcount;
      this.posts = postdata.posts;
    });
    this.userIsAuthenticated = this.authService.getisAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(pagedata: PageEvent) {
    this.isLoading = true;
    this.currentpage = pagedata.pageIndex + 1;
    this.postsperpage = pagedata.pageSize;
    this.postsService.getPosts(this.postsperpage, this.currentpage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsperpage, this.currentpage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postssub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
