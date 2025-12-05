# GlenNOW

GlenNOW is a mobile app that allows users to explore projects in Watkins Glen, request new projects, and submit feedback or edit requests on existing projects.

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Core Features](#core-features)  
3. [Mobile App Architecture](#mobile-app-architecture)  
4. [Setup & Running the App](#setup--running-the-app)  
5. [Dependencies](#dependencies)
6. [Native Device Features](#native-device-features)

---

## Project Overview

- **Problem Addressed:** Many small projects or initiatives lack a centralized platform for submission, tracking, and feedback. GlenNOW provides a clean, mobile-first solution for project exploration and communication.  
- **Target Users:** Local developers, creators, and project enthusiasts in Watkins Glen.  
- **Key Features:**  
  - Browse curated projects with descriptions, images, and sources.  
  - Submit requests for new projects through a simple modal form.  
  - Request edits on existing projects with timestamped feedback sent to the admin.  
  - Dark mode toggle for a modern, user-friendly experience.  
  - Offline-first features with local storage using AsyncStorage.

---

## Core Features

1. **Project Browsing:**  
   Users can scroll through a list of projects. Each project shows its title, description, and images. Sources are clickable links.  

2. **Project Submission:**  
   Users can request new projects via a form, including title, description, images, and contact email. Submissions are sent to the admin and saved locally.  

3. **Edit Requests:**  
   Users can request edits on existing projects. Feedback is timestamped, emailed to the admin, and saved locally.  

4. **Dark Mode:**  
   A switch toggles between light and dark themes for a comfortable viewing experience.  

5. **Local Storage:**  
   All project data and requests are saved locally using AsyncStorage, ensuring offline accessibility.  

6. **Admin Panel:**  
   Add projects for the user to discover. Can make updates to the site banner and remove projects.

---

## Mobile App Architecture

**Folder Structure:**

/GlenNOW
│
├─ /components # Reusable components (GlassCard, RequestModal, Timeline)
├─ /screens # Main screens (HomeScreen, ProjectScreen, AdminScreen)
├─ /storage # AsyncStorage utilities for projects and settings
├─ App.js # Entry point and navigation setup
└─ package.json # Project dependencies


**State Management & Navigation:**  
- React Navigation handles screen navigation.  
- Component state and hooks (`useState`, `useEffect`) manage data and dark mode.  

**Data Handling:**  
- AsyncStorage stores projects, requests, and user preferences locally.  
- No external APIs are used; all data is stored and retrieved locally.  

---

## Setup & Running the App

### Prerequisites
- iOS Simulator / Android Emulator or physical device using Expo

### Installation
1. Clone the repository
2. Install dependencies (npm install ___)
3. npm install
4. npm start


Scan the QR code with Expo Go (iOS/Android)

Or run on simulator/emulator

### Dependencies
React Native – Cross-platform mobile framework

Expo – Development and build tools

React Navigation – Screen navigation

AsyncStorage – Local persistent storage

Expo Vector Icons – Icons for UI

Other UI Libraries – GlassCard, Timeline, RequestModal components

No external APIs are used; all data is handled locally.

### Native Device Features
Email: Users can send project edit requests or contact developers via the device's email client.

Storage: AsyncStorage allows offline access and local saving of requests.

Share: Projects can be exported via native sharing features.