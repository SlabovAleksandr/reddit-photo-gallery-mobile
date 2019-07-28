import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

declare const reddit;

export class RedditResult {
  imgUrl: string;
  title: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class RedditService {

  protected static SEARCH_LIMIT = 5;
  protected static SEARCH_RESTRICT = 1;

  constructor() { }

  public search(searchText: string, afterName?: string): Observable<RedditResult[]> {
    const redditSearch = reddit.search(searchText, 'pics')
      .limit(RedditService.SEARCH_LIMIT)
      .restrict_sr(RedditService.SEARCH_RESTRICT);

    if (afterName) {
      redditSearch.after(afterName);
    }

    return Observable.create(observer => {
      redditSearch.fetch(res => {
        const redditResult = res.data.children.map(data => {
          const parsedResult = {
            imgUrl: data.data.url,
            title: data.data.title,
            name: data.data.name
          };
          return parsedResult;
        });
        observer.next(redditResult);
        observer.complete();
      }, err => {
        console.log(err);
      });
    });
  }
}
