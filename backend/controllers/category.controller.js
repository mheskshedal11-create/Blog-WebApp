import Category from '../models/category.model.js';

//create category 
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if the category already exists
        const category = await Category.findOne({ name });
        if (category) {
            return res.status(400).json({
                success: false,
                message: "Category Already Created"
            });
        }

        // Create a new category
        const newCategory = new Category({ name });

        // Save the new category (slug will be generated automatically due to the pre-save hook)
        await newCategory.save();

        // Return the response
        return res.status(200).json({
            success: true,
            message: "Category Created Successfully",
            category: newCategory
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to Create Category - Server error'
        });
    }
};

// update category
export const updateCategoryController = async (req, res) => {
    try {
        const { slug } = req.params
        const { name } = req.body

        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Slug not found"
            })
        }

        // Check if another category with the same name already exists
        const existingCategory = await Category.findOne({ name })

        // IMPORTANT: Check if it's a DIFFERENT category
        if (existingCategory && existingCategory.slug !== slug) {
            return res.status(400).json({
                success: false,
                message: 'Category name already exists'
            })
        }

        // Update the category
        const category = await Category.findOneAndUpdate(
            { slug: slug },
            { name },
            { new: true }
        )

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Category Updated Successfully",
            category
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Update failed",
            error: error.message
        })
    }
}

//delete category
export const deleteCategoryControlller = async (req, res) => {
    try {
        const { slug } = req.params
        const category = await Category.findOne({ slug })
        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'Category Not Found '
            })
        }
        await Category.findOneAndDelete({ slug })
        return res.status(200).json({
            success: false,
            message: 'Category Delete Successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'category cannot delete'
        })
    }
}