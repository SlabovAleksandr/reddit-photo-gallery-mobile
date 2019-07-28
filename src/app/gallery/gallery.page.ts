import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { RedditResult, RedditService } from './providers/reddit.service';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {

  public redditSearchText: string;
  public redditResults$: BehaviorSubject<RedditResult[]> = new BehaviorSubject(Object([]));

  constructor(
    private redditService: RedditService,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private iab: InAppBrowser
  ) { }

  ngOnInit() {
  }

  public async onSearchChange() {
    if (!this.redditSearchText.length) {
      return;
    }

    const loading = await this.loadingCtrl.create({
      spinner: 'crescent'
    });
    loading.present();

    this.redditService
      .search(this.redditSearchText)
      .pipe(
        tap(() => loading.dismiss())
      )
      .subscribe(res => this.redditResults$.next(res));
  }

  public async loadMore(event) {
    const afterRedditName = this.redditResults$.value[this.redditResults$.value.length - 1].name;
    this.redditService
      .search(this.redditSearchText, afterRedditName)
      .pipe(
        tap(() => event.target.complete())
      )
      .subscribe(res => {
        res.map(redditResult => this.redditResults$.next([
          ...this.redditResults$.value,
          redditResult
        ]));
      });
  }

  public openReddit(url) {
    const isBrowserPlatform = this.platform.is('mobileweb');
    const browser = this.iab.create(
      url,
      '_blank',
      'location=yes'
    );

    if (!isBrowserPlatform) {
      browser.on('loaderror').subscribe(() => {
        browser.close();
      });
    }
  }
}
