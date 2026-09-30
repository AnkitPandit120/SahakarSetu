# SahakarSetu — Project Images Location & Usage Guide

## 📁 Image Folders

There are two key folders in this project:

1. **`public/images/`** (Primary Runtime Directory):
   - This is where the React/Vite frontend and Express server load all static images from.
   - Any image placed here can be accessed in browser or code as `/images/<filename>`.
   - **Path in project**: `public/images/`

2. **`all_project_images/`** (Full Consolidated Backup & Archive):
   - Created specifically to hold **all 13 images** used in this project in one place.
   - **Path in project**: `all_project_images/`

---

## 🗺️ Complete Mapping: Images, Their Original Source, and Where They Are Used

| Image Name | Original Source / URL | Where It Is Used in This Project |
| :--- | :--- | :--- |
| **`modi_portrait.jpg`** | Official PM Portrait | • `src/components/GovernmentImageSlider.tsx` (Slide 1, 3, 5)<br>• `src/data/slides.ts`<br>• `public/manifest.json` (PWA Icons)<br>• `public/service-worker.js`<br>• `views/partials/slider-slide.ejs` |
| **`amit_shah_portrait.jpg`** | Official Ministry Portrait | • `src/components/GovernmentImageSlider.tsx` (Slide 1, 2)<br>• `src/data/slides.ts`<br>• `public/service-worker.js` |
| **`yogi_portrait.jpg`** | Official State Portrait | • `src/data/slides.ts`<br>• `public/service-worker.js` |
| **`cooperation_banner.jpg`** | `https://cooperation.gov.in/sites/default/files/2024-12/cooperation%20Banner.jpg` | • `src/components/GovernmentImageSlider.tsx` (Hero watermark & background)<br>• `src/data/slides.ts` |
| **`crcs_sahara_banner.jpg`** | `https://crcs.gov.in/public/landing/images/banner-4.jpg` | • `src/components/GovernmentImageSlider.tsx` (Slide 2: CRCS Sahara Refund Portal)<br>• `src/data/slides.ts` |
| **`farmer_sugarcane.jpg`** | `https://img.magnific.com/free-photo/indian-farmer-sugarcane-field_23-2151996287.jpg` | • `src/components/GovernmentImageSlider.tsx` (Mann Ki Baat, SVEP, PACS slides)<br>• `src/data/slides.ts` |
| **`citizen_beneficiary.jpg`** | Google CDN / MyGov archive | • `src/components/GovernmentImageSlider.tsx` (CRCS beneficiary, SVEP women SHG)<br>• `src/data/slides.ts` |
| **`agricultural_land.jpg`** | `https://landvaluetools.com/images/blog/agricultural-land-measurement-guide.jpg` | • `src/data/slides.ts` (Land & crop insurance schemes) |
| **`pacs_farmer_cooperative.jpg`** | Field cooperative photograph | • `src/components/GovernmentImageSlider.tsx`<br>• `public/service-worker.js` |
| **`modi_web_thumbnail.jpg`** | Google CDN thumbnail | • Reference in `slides.ts` & archive |
| **`amit_shah_web.jpg`** | `https://www.jkbjp.in/wp-content/uploads/2016/10/Amit-Shah-Ji-14.jpg` | • Reference in `slides.ts` & archive |
| **`yogi_web.jpg`** | `https://i.pinimg.com/736x/dd/7e/7f/dd7e7f211cb2f8bdc0a0cbaf662aa4ad.jpg` | • Reference in `slides.ts` & archive |
| **`test.jpg`** | Local project fixture | • Testing & document upload demo |
