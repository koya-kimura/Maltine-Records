// ImageGallery は複数のディレクトリから静止画を読み込んで表示するクラス。
import p5 from "p5";

export class ImageGallery {
    private images: Map<string, p5.Image[]>; // ディレクトリ名 -> 画像配列
    private currentCategory: string;
    private currentImageIndex: number;
    private isLoaded: boolean;

    /**
     * ImageGalleryクラスのコンストラクタです。
     * 複数のディレクトリから画像を読み込み、静止画として表示する機能を提供します。
     */
    constructor() {
        this.images = new Map();
        this.currentCategory = "";
        this.currentImageIndex = 0;
        this.isLoaded = false;
    }

    /**
     * 指定されたディレクトリ構造から画像を非同期で読み込みます。
     * 
     * @param p p5.jsのインスタンス。画像のロード機能を提供します。
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

        // 最初のカテゴリを選択
        if (categories.length > 0) {
            this.currentCategory = categories[0].name;
        }

        this.isLoaded = true;
        console.log(`Loaded ${categories.length} image categories`);
    }

    /**
     * 現在選択されている画像を取得します。
     * 
     * @returns 現在の画像のp5.Imageオブジェクト、または未ロード時はnull
     */
    getCurrentImage(): p5.Image | null {
        if (!this.isLoaded || !this.currentCategory) {
            return null;
        }

        const categoryImages = this.images.get(this.currentCategory);
        if (!categoryImages || categoryImages.length === 0) {
            return null;
        }

        return categoryImages[this.currentImageIndex] || null;
    }

    /**
     * 現在の画像を指定した座標に描画します。
     * 
     * @param p p5.jsのインスタンス、またはp5.Graphicsオブジェクト。
     * @param x 描画位置のX座標。
     * @param y 描画位置のY座標。
     * @param w 描画する幅（省略可能）。
     * @param h 描画する高さ（省略可能）。
     */
    draw(p: p5 | p5.Graphics, x: number, y: number, w?: number, h?: number): void {
        const currentImage = this.getCurrentImage();
        if (!currentImage) {
            return;
        }

        if (w !== undefined && h !== undefined) {
            p.image(currentImage, x, y, w, h);
        } else {
            p.image(currentImage, x, y);
        }
    }

    /**
     * カテゴリを切り替えます。
     * 
     * @param categoryName カテゴリ名
     */
    setCategory(categoryName: string): void {
        if (this.images.has(categoryName)) {
            this.currentCategory = categoryName;
            this.currentImageIndex = 0; // 画像インデックスをリセット
        }
    }

    /**
     * 現在のカテゴリ内の画像インデックスを設定します。
     * 
     * @param index 画像インデックス
     */
    setImageIndex(index: number): void {
        const categoryImages = this.images.get(this.currentCategory);
        if (categoryImages && index >= 0 && index < categoryImages.length) {
            this.currentImageIndex = index;
        }
    }

    /**
     * 現在のカテゴリ名を取得します。
     * 
     * @returns カテゴリ名
     */
    getCurrentCategory(): string {
        return this.currentCategory;
    }

    /**
     * 現在の画像インデックスを取得します。
     * 
     * @returns 画像インデックス
     */
    getCurrentImageIndex(): number {
        return this.currentImageIndex;
    }

    /**
     * 全カテゴリ名のリストを取得します。
     * 
     * @returns カテゴリ名の配列
     */
    getCategories(): string[] {
        return Array.from(this.images.keys());
    }

    /**
     * 画像が読み込み完了しているかを確認します。
     * 
     * @returns 読み込み完了している場合はtrue
     */
    isReady(): boolean {
        return this.isLoaded;
    }
}
