# open.DASH Base Style

The open.DASH Base Style brings everything that is needed to deliver a functional open.DASH installation but to get the most out of it, make sure to load the following resources:

* Raleway Font
* Roboto Font in 400, 400i, 700 and 700i
* fontawesome Icon Font
* animate.css

This can be done in your CSS/SCSS file like this:

```css
@import url('https://fonts.googleapis.com/css?family=Raleway|Roboto:400,400i,700,700i');
@import url('https://cdn.jsdelivr.net/animatecss/3.5.2/animate.min.css');
@import url('https://cdn.jsdelivr.net/fontawesome/4.7.0/css/font-awesome.min.css');
```

## z-index

- Content: 2000
- Loading: 3000
  - Widget Controls: 3100
  - Auth: 3200
- Modal: 4000
- Header: 5000
  - Sidebar: 5200
  - Topbar: 5400
- Notification: 6000
