import { RouteData } from '../types';

export class Router {
  private readonly routeData: RouteData;

  public currentPage: string = '';

  constructor(routeData: RouteData) {
    this.routeData = routeData;
  }

  redirect(pageName: keyof typeof this.routeData): void {
    const route = this.routeData[pageName];

    this.currentPage = route.path;

    Object.values(this.routeData).forEach((el) => {
      el.page.classList.add('hidden');
    });
    route.page.classList.remove('hidden');
    window.history.replaceState({}, '', `/${pageName}`);
  }
}
