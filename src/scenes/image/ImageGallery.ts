// ImageGallery は複数のカテゴリから静止画を管理するクラス。
// カテゴリ名とインデックスを指定すると画像を返す。
import p5 from "p5";

export class ImageGallery {
    private images: Map<string, p5.Image[]>;

    constructor() {
        this.images = new Map();
    }

    /**
     * 指定されたディレクトリ構造から画像を非同期で読み込みます。
     * 
     * @param p p5.jsのインスタンス
     * @param basePath 画像ディレクトリのベースパス（例: "/image"）
     * @param categories カテゴリ情報の配列 [{name: "animal", count: 3}, ...]
     */
    async load(
        p: p5,
        basePath: string,
        categories: { name: string; count: number }[]
    ): Promise<void> {
        const loadPromises: Promise<void>[] = [];

        for (const category of categories) {
            const categoryImages: p5.Image[] = [];
            this.images.set(category.name, categoryImages);

            for (let i = 1; i <= category.count; i++) {
                const imagePath = `${basePath}/${category.name}/${i}.png`;

                const promise = new Promise<void>((resolve) => {
                    p.loadImage(
                        imagePath,
                        (img) => {
                            categoryImages[i - 1] = img;
                            resolve();
                        },
                        () => {
                            console.warn(`Failed to load image: ${imagePath}`);
                            resolve();
                        }
                    );
                });

                loadPromises.push(promise);
            }
        }

        await Promise.all(loadPromises);
        console.log(`Loaded ${categories.length} image categories`);
    }

    /**
     * 指定したカテゴリとインデックスの画像を取得
     * 
     * @param category カテゴリ名
     * @param index 画像インデックス（0始まり）
     * @returns p5.Imageオブジェクト
     * @throws Error カテゴリまたはインデックスが存在しない場合
     */
    getImage(category: string, index: number): p5.Image {
        const categoryImages = this.images.get(category);
        if (!categoryImages) {
            throw new Error(`ImageGallery: category "${category}" not found`);
        }
        const img = categoryImages[index];
        if (!img) {
            throw new Error(`ImageGallery: index ${index} not found in category "${category}" (max: ${categoryImages.length - 1})`);
        }
        return img;
    }

    /**
     * 指定したカテゴリの画像数を取得
     */
    getImageCount(category: string): number {
        return this.images.get(category)?.length || 0;
    }

    /**
     * 指定したカテゴリの画像数を取得（getImageCountのエイリアス）
     * @param category カテゴリ名
     * @returns 画像数
     */
    getLength(category: string): number {
        return this.getImageCount(category);
    }

    /**
     * 全カテゴリ名を取得
     */
    getCategories(): string[] {
        return Array.from(this.images.keys());
    }

    /**
     * 全カテゴリ名を取得（getCategoriesのエイリアス）
     * @returns カテゴリ名の配列
     */
    getLabels(): string[] {
        return this.getCategories();
    }
}
