# Images (placeholder note)

The site currently draws styled placeholders instead of photos, so it works with no images at all.

To add real photos:

1. Put the files in `assets/images/` (JPG or WebP, about 1600px wide, under 400 KB each).
2. Open `js/data.js` and list the paths in the item's `images` array, for example:

```js
images: ['assets/images/minimal-kitchen-1.jpg', 'assets/images/minimal-kitchen-2.jpg']
```

Where images are used:

- `home.hero.images`: the featured banner on the home page
- `projects[].images`: project cards and the project gallery (the gallery shows one slide per image)
- `engineers[].photo`: profile photo, e.g. `'assets/images/loay.jpg'`
- `projects[].materials[].image` (optional): a photo of the material; otherwise a colour swatch is drawn

Use photos you own or have a licence for. `favicon.svg` is the ALMA mark redrawn as a simple placeholder; replace it with the official logo file when available.
