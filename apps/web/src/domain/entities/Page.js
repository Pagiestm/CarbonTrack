export class Page {
  constructor({ items = [], total = 0, page = 1, perPage = 12, pageCount = 1 }) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.perPage = perPage;
    this.pageCount = pageCount;
  }

  static vide() {
    return new Page({});
  }

  get isEmpty() {
    return this.total === 0;
  }

  get from() {
    return this.isEmpty ? 0 : (this.page - 1) * this.perPage + 1;
  }

  get to() {
    return Math.min(this.page * this.perPage, this.total);
  }
}
