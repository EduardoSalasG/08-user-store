import { ProductModel } from "../../data";
import { CreateProductDTO, CustomError, PaginationDTO, UserEntity } from "../../domain";

export class ProductService {

    //DI
    constructor(
    ) { }


    async createProduct(createProductDTO: CreateProductDTO, user: UserEntity) {

        const productExists = await ProductModel.findOne({ name: this.createProduct.name });

        if (productExists) throw CustomError.badRequest('Product already exists');

        try {
            const product = new ProductModel({
                ...createProductDTO,
                user: user.id,
            })

            await product.save();

            return {
                id: product.id,
                name: product.name,
                available: product.available,
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

    }

    async getProducts(paginationDto: PaginationDTO) {

        const { page, limit } = paginationDto;

        try {

            const [total, products] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('user')
                    .populate('category')
            ])

            return {
                page,
                limit,
                total,
                next: `/api/products?page=${page + 1}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/api/products?page=${page - 1}&limit=${limit}` : null,
                products: products.map((product) => (
                    {
                        id: product.id,
                        name: product.name,
                        available: product.available,
                        user: product.user,
                        category: product.category
                    }
                ))
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)

        }
    }

}