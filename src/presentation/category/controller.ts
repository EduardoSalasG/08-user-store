import { Request, Response } from "express";
import { CreateCategoryDTO, CustomError, PaginationDTO } from "../../domain";
import { CategoryService } from "../services";

export class CategoryController {

    //DI
    constructor(
        public readonly categoryService: CategoryService,
    ) { }

    private handleError = ((error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message })
        }

        console.log(`${error}`)
        return res.status(500).json({ error: 'Internal server error' })

    })

    createCategory = async (req: Request, res: Response) => {
        const [error, createCategoryDTO] = CreateCategoryDTO.create(req.body);
        if (error) return res.status(400).json({ error })

        this.categoryService.createCategory(createCategoryDTO!, req.body.user)
            .then(category => res.status(201).json(category))
            .catch(error => this.handleError(error, res));

    }

    getCategories = async (req: Request, res: Response) => {

        const { page = 1, limit = 10 } = req.query;

        const [error, paginationDto] = PaginationDTO.create(+page, +limit);

        if (error) return res.status(400).json({ error })

        this.categoryService.getCategories(paginationDto!)
            .then(categories => res.json(categories))
            .catch(error => this.handleError(error, res));
    }




}