import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductStore } from '@/stores/productStore';
import { Package } from 'lucide-react';
import { motion } from 'framer-motion';

interface Category {
    id: string;
    name: string;
    description?: string;
}

// Component con cho từng thẻ danh mục
const CategoryCard = ({ category, onClick, delay }: { category: Category; onClick: (id: string, name: string) => void; delay: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay }}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
        >
            <Card
                className="hover:shadow-lg transition-shadow"
                onClick={() => onClick(category.id, category.name)}
            >
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {category.name}
                            </CardTitle>
                        </div>
                    </div>
                    <CardDescription className="mt-2">
                        {category.description || 'Khám phá các sản phẩm trong danh mục này'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        variant="outline"
                        className="w-full hover:bg-gray-400 hover:text-white"
                        onClick={(e) => {
                            e.stopPropagation(); // Ngăn sự kiện click lan lên Card cha
                            onClick(category.id, category.name);
                        }}
                    >
                        Xem sản phẩm
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// Component Loading Skeleton
const CategoryLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
                <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
                </CardHeader>
                <CardContent>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </CardContent>
            </Card>
        ))}
    </div>
);

export function CategoriesPage() {
    const navigate = useNavigate();
    const {
        categories,
        isLoading,
        error,
        fetchCategories,
        clearError
    } = useProductStore();

    // Load categories khi component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryId: string, categoryName: string) => {
        // Navigate đến trang products với filter category
        navigate(`/products?category=${categoryId}&name=${encodeURIComponent(categoryName)}`);
    };

    return (
        <>
            <Header />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="min-h-screen bg-gray-50">

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        {/* Page Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Danh mục sản phẩm</h1>
                            <p className="text-gray-600">
                                Khám phá các danh mục sản phẩm đa dạng của chúng tôi
                            </p>
                        </div>

                        {/* Error State */}
                        {error && (
                            <Card className="max-w-2xl mx-auto mb-8">
                                <CardContent className="text-center py-6">
                                    <p className="text-red-600 mb-4">{error}</p>
                                    <Button onClick={() => {
                                        clearError();
                                        fetchCategories();
                                    }}>
                                        Thử lại
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Loading State */}
                        {isLoading && <CategoryLoadingSkeleton />}

                        {/* Categories Grid */}
                        {!isLoading && !error && categories.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categories.map((category, index) => (
                                    <CategoryCard
                                        key={category.id}
                                        category={category}
                                        onClick={handleCategoryClick}
                                        delay={index * 0.1} // Tạo delay lần lượt cho từng card
                                    />
                                ))}
                            </motion.div>
                        )}

                        {/* Empty State */}
                        {!isLoading && !error && categories.length === 0 && (
                            <Card className="max-w-2xl mx-auto">
                                <CardHeader>
                                    <CardTitle>Chưa có danh mục nào</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-4">
                                        Hiện tại chưa có danh mục sản phẩm nào được tạo.
                                    </p>
                                    <Button onClick={() => navigate('/products')}>
                                        Xem tất cả sản phẩm
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Back to Products */}
                        <div className="mt-12 text-center">
                            <Button
                                variant="outline"
                                onClick={() => navigate('/products')}
                                className="flex items-center space-x-2"
                            >
                                <Package className="h-4 w-4" />
                                <span>Xem tất cả sản phẩm</span>
                            </Button>
                        </div>
                    </div>
                </main>
            </motion.div>
        </>
    );
}