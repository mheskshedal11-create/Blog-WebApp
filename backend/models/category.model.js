import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
        }
    },
    { timestamps: true }
);

// Pre-save hook for .save() method
categorySchema.pre('save', function (next) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
    next
});

// Pre-update hook for findOneAndUpdate
categorySchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.name) {
        update.slug = update.name.toLowerCase().replace(/\s+/g, '-');
    }
    next
});

const Category = mongoose.model("Category", categorySchema);

export default Category;