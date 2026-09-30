# Project Images Catalog & Location Guide

This folder contains **all images used in the SahakarSetu project**, along with details of where each image is used and its original source location.

---

## 📁 Image Directory Locations

1. **Active Web Serving Directory**:
   `public/images/`
   *(All images in this directory are served directly by Vite / Express at `/images/<filename>`)*

2. **Dedicated Project Archive & Backup Directory**:
   `all_project_images/`
   *(Contains all downloaded, local, and reference images collected in one place)*

---

## 🖼️ Complete List of Images

| File Name | Original Source / Origin Location | Where Used in the Project | Purpose / Description |
| :--- | :--- | :--- | :--- |
| **`modi_portrait.jpg`** | Official Government of India Prime Minister Portrait | • `src/components/GovernmentImageSlider.tsx`<br>• `src/data/slides.ts` (`LEADER_IMAGES.modi`)<br>• `public/manifest.json` (PWA app icons)<br>• `public/service-worker.js` (Offline cache)<br>• `views/partials/slider-slide.ejs` | Hon'ble Prime Minister Narendra Modi portrait in Sahakar Se Samriddhi, Mann Ki Baat, and Digital India slides. |
| **`amit_shah_portrait.jpg`** | Official Ministry of Cooperation / Government Portrait | • `src/components/GovernmentImageSlider.tsx`<br>• `src/data/slides.ts` (`LEADER_IMAGES.amitShah`)<br>• `public/service-worker.js` | Hon'ble Union Minister of Home Affairs & Cooperation Shri Amit Shah in Sahakar Se Samriddhi & CRCS Sahara Refund slides. |
| **`yogi_portrait.jpg`** | Official State Government of Uttar Pradesh Portrait | • `src/data/slides.ts` (`LEADER_IMAGES.yogi`)<br>• `public/service-worker.js` | State-level cooperative governance initiatives & UP rural PACS support. |
| **`cooperation_banner.jpg`** | `https://cooperation.gov.in/sites/default/files/2024-12/cooperation%20Banner.jpg` *(Ministry of Cooperation official portal)* | • `src/components/GovernmentImageSlider.tsx` (Slide 1 background & Slide 7 montage)<br>• `src/data/slides.ts` (`LEADER_IMAGES.cooperationBanner`) | High-resolution official Ministry of Cooperation banner watermark and background. |
| **`crcs_sahara_banner.jpg`** | `https://crcs.gov.in/public/landing/images/banner-4.jpg` *(CRCS Sahara Refund official portal)* | • `src/components/GovernmentImageSlider.tsx` (Slide 2: CRCS Sahara Refund Portal)<br>• `src/data/slides.ts` (`LEADER_IMAGES.crcsBanner`) | Central Registrar of Cooperative Societies launch banner & portal hero graphic. |
| **`pacs_farmer_cooperative.jpg`** | Ground photo: Primary Agricultural Credit Society field advisory | • `src/components/GovernmentImageSlider.tsx` (PACS & Digital Farmer Network slide)<br>• `public/service-worker.js` | PACS grassroots cooperative operations and farmer engagement. |
| **`farmer_sugarcane.jpg`** | `https://img.magnific.com/free-photo/indian-farmer-sugarcane-field_23-2151996287.jpg` | • `src/components/GovernmentImageSlider.tsx` (Mann Ki Baat citizen photo, SVEP camp, PACS empowerment)<br>• `src/data/slides.ts` (`LEADER_IMAGES.farmerSugarcane`) | Indian farmer in agricultural field representing rural beneficiaries. |
| **`citizen_beneficiary.jpg`** | Google CDN / MyGov beneficiary archive | • `src/components/GovernmentImageSlider.tsx` (Slide 2: CRCS citizen greeting namaste; Slide 7: Rural Women SHG card)<br>• `src/data/slides.ts` (`LEADER_IMAGES.citizenBeneficiary`) | Rural citizen and women Self-Help Group (SHG) cooperative entrepreneurs. |
| **`agricultural_land.jpg`** | `https://landvaluetools.com/images/blog/agricultural-land-measurement-guide.jpg` | • `src/data/slides.ts` (`LEADER_IMAGES.agriculturalLand`) | Agricultural land measurement, KCC credit, and crop insurance guidance. |
| **`modi_web_thumbnail.jpg`** | Google image search CDN cached asset | • `all_project_images/modi_web_thumbnail.jpg`<br>• Reference thumbnail in `slides.ts` | Web reference thumbnail for PM portrait. |
| **`amit_shah_web.jpg`** | `https://www.jkbjp.in/wp-content/uploads/2016/10/Amit-Shah-Ji-14.jpg` | • `all_project_images/amit_shah_web.jpg`<br>• Reference image in `slides.ts` | Web reference portrait for Union Minister of Cooperation. |
| **`yogi_web.jpg`** | `https://i.pinimg.com/736x/dd/7e/7f/dd7e7f211cb2f8bdc0a0cbaf662aa4ad.jpg` | • `all_project_images/yogi_web.jpg`<br>• Reference image in `slides.ts` | Web reference portrait for Chief Minister Yogi Adityanath. |
| **`test.jpg`** | Local project fixture | • `public/images/test.jpg` | Local test fixture asset for document and image upload tests. |

---

## 🚀 How to Add New Images

1. Copy your new image into `public/images/<new-image-name>.jpg` (and `all_project_images/`).
2. In React components, reference it directly with:
   ```tsx
   <img src="/images/<new-image-name>.jpg" alt="Description" />
   ```
3. Or in `src/data/slides.ts`, add it to `LEADER_IMAGES`:
   ```ts
   export const LEADER_IMAGES = {
     // ...
     myNewImage: '/images/<new-image-name>.jpg'
   };
   ```
