import Blog from '../models/blog.schema.js';
import User from '../models/user.model.js';
import Category from '../models/category.model.js';

// Search blogs by title, author, and category
export const searchBlogController = async (req, res) => {
    try {
        const { query, author, category, status = 'Accept', page = 1, limit = 10 } = req.query;

        // Build search filter
        const searchFilter = { status };

        // Search by title or excerpt or description (if query provided)
        if (query) {
            searchFilter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { excerpt: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { tag: { $in: [new RegExp(query, 'i')] } }
            ];
        }

        // Search by author name
        if (author) {
            const users = await User.find({
                $or: [
                    { username: { $regex: author, $options: 'i' } },
                    { email: { $regex: author, $options: 'i' } }
                ]
            }).select('_id');

            const userIds = users.map(user => user._id);
            searchFilter.author = { $in: userIds };
        }

        // Search by category name
        if (category) {
            const categories = await Category.find({
                name: { $regex: category, $options: 'i' }
            }).select('_id');

            const categoryIds = categories.map(cat => cat._id);
            searchFilter.category = { $in: categoryIds };
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute search with population
        const blogs = await Blog.find(searchFilter)
            .populate('author', 'username email avatar')
            .populate('category', 'name slug')
            .populate({
                path: 'comment',
                populate: {
                    path: 'user',
                    select: 'username avatar'
                }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Blog.countDocuments(searchFilter);

        res.status(200).json({
            success: true,
            data: blogs,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching blogs',
            error: error.message
        });
    }
};

// Advanced search with multiple filters
export const advancedSearch = async (req, res) => {
    try {
        const {
            query,
            author,
            category,
            tags,
            status = 'Accept',
            sortBy = 'createdAt',
            order = 'desc',
            page = 1,
            limit = 10
        } = req.query;

        const searchFilter = { status };

        // Text search
        if (query) {
            searchFilter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { excerpt: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }

        // Author search
        if (author) {
            const users = await User.find({
                $or: [
                    { username: { $regex: author, $options: 'i' } },
                    { email: { $regex: author, $options: 'i' } }
                ]
            }).select('_id');

            if (users.length > 0) {
                searchFilter.author = { $in: users.map(u => u._id) };
            } else {
                return res.status(200).json({
                    success: true,
                    data: [],
                    pagination: { total: 0, page: 1, limit: parseInt(limit), pages: 0 }
                });
            }
        }

        // Category search
        if (category) {
            const categories = await Category.find({
                name: { $regex: category, $options: 'i' }
            }).select('_id');

            if (categories.length > 0) {
                searchFilter.category = { $in: categories.map(c => c._id) };
            } else {
                return res.status(200).json({
                    success: true,
                    data: [],
                    pagination: { total: 0, page: 1, limit: parseInt(limit), pages: 0 }
                });
            }
        }

        // Tags search (comma-separated)
        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            searchFilter.tag = { $in: tagArray.map(tag => new RegExp(tag, 'i')) };
        }

        // Sort options
        const sortOrder = order === 'asc' ? 1 : -1;
        const sortOptions = { [sortBy]: sortOrder };

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const blogs = await Blog.find(searchFilter)
            .populate('author', 'username email avatar')
            .populate('category', 'name slug description')
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Blog.countDocuments(searchFilter);

        res.status(200).json({
            success: true,
            data: blogs,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            },
            filters: {
                query,
                author,
                category,
                tags,
                status,
                sortBy,
                order
            }
        });

    } catch (error) {
        console.error('Advanced search error:', error);
        res.status(500).json({
            success: false,
            message: 'Error performing advanced search',
            error: error.message
        });
    }
};

// Get search suggestions (autocomplete)
export const getSearchSuggestions = async (req, res) => {
    try {
        const { query, type = 'all' } = req.query;

        if (!query || query.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Query must be at least 2 characters'
            });
        }

        const suggestions = {
            titles: [],
            authors: [],
            categories: [],
            tags: []
        };

        // Get title suggestions
        if (type === 'all' || type === 'title') {
            const titleBlogs = await Blog.find({
                title: { $regex: query, $options: 'i' },
                status: 'Accept'
            })
                .select('title')
                .limit(5);

            suggestions.titles = titleBlogs.map(blog => blog.title);
        }

        // Get author suggestions
        if (type === 'all' || type === 'author') {
            const authors = await User.find({
                username: { $regex: query, $options: 'i' }
            })
                .select('username')
                .limit(5);

            suggestions.authors = authors.map(author => author.username);
        }

        // Get category suggestions
        if (type === 'all' || type === 'category') {
            const categories = await Category.find({
                name: { $regex: query, $options: 'i' }
            })
                .select('name')
                .limit(5);

            suggestions.categories = categories.map(cat => cat.name);
        }

        // Get tag suggestions
        if (type === 'all' || type === 'tag') {
            const tagBlogs = await Blog.aggregate([
                { $match: { status: 'Accept' } },
                { $unwind: '$tag' },
                { $match: { tag: { $regex: query, $options: 'i' } } },
                { $group: { _id: '$tag' } },
                { $limit: 5 }
            ]);

            suggestions.tags = tagBlogs.map(item => item._id);
        }

        res.status(200).json({
            success: true,
            data: suggestions
        });

    } catch (error) {
        console.error('Suggestions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting search suggestions',
            error: error.message
        });
    }
};