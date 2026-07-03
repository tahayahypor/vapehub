from decimal import Decimal

from sqlalchemy import select

from app.database.session import SessionLocal
from app.models import Category, Product


CATEGORIES = [
    {"name": "پاد سیستم", "slug": "pod"},
    {"name": "ویپ", "slug": "vape"},
    {"name": "سالت نیکوتین", "slug": "salt"},
    {"name": "جویس", "slug": "juice"},
    {"name": "کویل", "slug": "coil"},
    {"name": "کارتریج", "slug": "cartridge"},
    {"name": "لوازم جانبی", "slug": "accessories"},
]


PRODUCTS = [
    {
        "name": "پاد سیستم ایجیس نانو 2 گیک ویپ",
        "slug": "geek-vape-aegis-nano-2",
        "brand": "GEEK VAPE",
        "category": "pod",
        "price": Decimal("4800000"),
        "stock": 10,
        "image_url": "/products/geek-vape-aegis-nano-2.png",
        "description": "پاد سیستم مقاوم و مناسب استفاده روزانه.",
        "specifications": {
            "type": "پاد سیستم",
            "battery": "1100mAh",
            "power": "30W",
            "cartridge": "2ml",
        },
    },
    {
        "name": "پاد ماد سنتاروس E40 لاست ویپ",
        "slug": "lost-vape-centaurus-e40",
        "brand": "LOST VAPE",
        "category": "pod",
        "price": Decimal("2900000"),
        "stock": 12,
        "image_url": "/products/lost-vape-centaurus-e40.png",
        "description": "پاد ماد با طراحی مدرن و توان مناسب.",
        "specifications": {
            "type": "پاد ماد",
            "battery": "1400mAh",
            "power": "40W",
            "cartridge": "3ml",
        },
    },
    {
        "name": "ویپ سنتاروس M100 لاست ویپ",
        "slug": "lost-vape-centaurus-m100",
        "brand": "LOST VAPE",
        "category": "vape",
        "price": Decimal("5400000"),
        "stock": 8,
        "image_url": "/products/lost-vape-centaurus-m100.png",
        "description": "ویپ حرفه‌ای با توان خروجی بالا.",
        "specifications": {
            "type": "ویپ",
            "battery": "18650",
            "power": "100W",
            "cartridge": "Tank",
        },
    },
    {
        "name": "پاد سیستم گلکسی S360 لاست ویپ",
        "slug": "lost-vape-galaxy-s360",
        "brand": "LOST VAPE",
        "category": "pod",
        "price": Decimal("4300000"),
        "stock": 9,
        "image_url": "/products/lost-vape-galaxy-s360.png",
        "description": "پاد سیستم سبک با طراحی متفاوت.",
        "specifications": {
            "type": "پاد سیستم",
            "battery": "1500mAh",
            "power": "35W",
            "cartridge": "3ml",
        },
    },
    {
        "name": "پاد سیستم کالیبرن G3 لایت کوکو",
        "slug": "uwell-caliburn-g3-lite-koko",
        "brand": "UWELL",
        "category": "pod",
        "price": Decimal("2400000"),
        "stock": 15,
        "image_url": "/products/uwell-caliburn-g3-lite-koko.png",
        "description": "پاد سیستم جمع‌وجور با طعم‌رسانی مناسب.",
        "specifications": {
            "type": "پاد سیستم",
            "battery": "1200mAh",
            "power": "25W",
            "cartridge": "2.5ml",
        },
    },
    {
        "name": "ویپ جن مکس ویپرسو",
        "slug": "vaporesso-gen-max",
        "brand": "VAPORESSO",
        "category": "vape",
        "price": Decimal("3100000"),
        "stock": 7,
        "image_url": "/products/vaporesso-gen-max.png",
        "description": "دستگاه ویپرسو با توان خروجی بالا.",
        "specifications": {
            "type": "ویپ",
            "battery": "Dual 18650",
            "power": "220W",
            "cartridge": "Tank",
        },
    },
    {
        "name": "پاد سیستم XROS 4 MINI",
        "slug": "vaporesso-xros-4-mini",
        "brand": "VAPORESSO",
        "category": "pod",
        "price": Decimal("2930000"),
        "stock": 18,
        "image_url": "/products/vaporesso-xros-4-mini.png",
        "description": "پاد سیستم سبک و مناسب استفاده روزانه.",
        "specifications": {
            "type": "پاد سیستم",
            "battery": "1000mAh",
            "power": "30W",
            "cartridge": "3ml",
        },
    },
    {
        "name": "پاد ماد ARGUS A",
        "slug": "voopoo-argus-a",
        "brand": "VOOPOO",
        "category": "pod",
        "price": Decimal("3740000"),
        "stock": 11,
        "image_url": "/products/voopoo-argus-a.png",
        "description": "پاد ماد با توان خروجی قابل تنظیم.",
        "specifications": {
            "type": "پاد ماد",
            "battery": "1100mAh",
            "power": "30W",
            "cartridge": "3ml",
        },
    },
    {
        "name": "جویس ویگاد",
        "slug": "vgod-juice",
        "brand": "VGOD",
        "category": "juice",
        "price": Decimal("780000"),
        "stock": 25,
        "image_url": "/products/vgod-juice.png",
        "description": "جویس 60 میلی‌لیتری مناسب دستگاه ویپ.",
        "specifications": {
            "type": "جویس",
            "volume": "60ml",
            "nicotine": "3mg",
        },
    },
    {
        "name": "سالت نیکوتین نستی",
        "slug": "nasty-salt",
        "brand": "NASTY",
        "category": "salt",
        "price": Decimal("650000"),
        "stock": 30,
        "image_url": "/products/nasty-salt.png",
        "description": "سالت نیکوتین مناسب پاد سیستم.",
        "specifications": {
            "type": "سالت نیکوتین",
            "volume": "30ml",
            "nicotine": "مختلف",
        },
    },
    {
        "name": "کویل یدک دستگاه ویپ",
        "slug": "vape-replacement-coil",
        "brand": "VAPE COIL",
        "category": "coil",
        "price": Decimal("320000"),
        "stock": 40,
        "image_url": "/products/vape-replacement-coil.png",
        "description": "کویل یدک برای دستگاه‌های سازگار.",
        "specifications": {
            "type": "کویل",
            "resistance": "مدل‌های مختلف",
            "count": "یک عدد",
        },
    },
    {
        "name": "کارتریج یدک پاد سیستم",
        "slug": "pod-replacement-cartridge",
        "brand": "POD CARTRIDGE",
        "category": "cartridge",
        "price": Decimal("380000"),
        "stock": 35,
        "image_url": "/products/pod-replacement-cartridge.png",
        "description": "کارتریج جایگزین پاد سیستم.",
        "specifications": {
            "type": "کارتریج",
            "capacity": "مدل‌های مختلف",
            "count": "یک عدد",
        },
    },
    {
        "name": "پکیج لوازم جانبی ویپ",
        "slug": "vape-accessories-bundle",
        "brand": "VAPEHUB",
        "category": "accessories",
        "price": Decimal("950000"),
        "stock": 10,
        "image_url": "/products/vape-accessories-bundle.png",
        "description": "پکیج لوازم نگهداری دستگاه.",
        "specifications": {
            "type": "لوازم جانبی",
            "contents": "چند قطعه",
        },
    },
]


def seed_catalog() -> None:
    with SessionLocal() as db:
        try:
            category_map = {}

            for data in CATEGORIES:
                category = db.scalar(
                    select(Category).where(
                        Category.slug == data["slug"]
                    )
                )

                if not category:
                    category = Category(**data)
                    db.add(category)
                else:
                    category.name = data["name"]
                    category.is_active = True

                db.flush()
                category_map[data["slug"]] = category

            for data in PRODUCTS:
                values = data.copy()
                category_slug = values.pop("category")

                product = db.scalar(
                    select(Product).where(
                        Product.slug == values["slug"]
                    )
                )

                values["category_id"] = (
                    category_map[category_slug].id
                )

                if not product:
                    product = Product(**values)
                    db.add(product)
                else:
                    for field, value in values.items():
                        setattr(product, field, value)

                    product.is_active = True

            db.commit()

        except Exception:
            db.rollback()
            raise

    print("Categories and products seeded successfully.")


if __name__ == "__main__":
    seed_catalog()