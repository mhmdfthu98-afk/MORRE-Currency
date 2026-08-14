# MORRE Currency

نسخة مرتبة من مشروع MORRE Currency.

## التنظيم
- ملفات CSS ليست منفصلة؛ CSS الخاص بكل صفحة موجود داخل نفس ملف HTML في وسم `<style>`.
- `index.html` يحتوي الواجهة وCSS وكود JavaScript الأساسي للصفحة.
- `admin.html` يحتوي لوحة الإدارة وCSS وكود JavaScript الخاص بها.
- `firebase.js` يحتوي إعدادات واتصالات Firebase المشتركة.
- ملفات الإعلانات تبقى وحدات JavaScript مستقلة، وليست ملفات CSS.
- تم حذف `app.js` القديم لأنه كان يعتمد على مسارات `services/` غير موجودة في المشروع.
- تم تنظيف Service Worker من مراجع ملفات غير موجودة.
