exports.build = function(mongoose) {
	var name = 'Song';
	var schema = mongoose.Schema({
		title: String,
		artist: [String],
		albumartist: [String],
		album: String,
		year: Number,
		genre: [String],
		type: String, // ogg, wav, mp4, mp3, fla
		path: String,
		duration: Number,
		upvotes: Number,
		downvotes: Number,
		added: Date,
		modified: Date,
		failures: Number
	});

	// Overridden to remove binary data from output
	schema.methods.toJSON = function() {
		var obj = this.toObject();
		obj.filename = this.filename;
		delete obj.path;
		return obj;
	};

	schema.virtual('filename').get(function() {
		return this.path.substring(this.path.lastIndexOf('/') + 1);
	});

	schema.virtual('score').get(function() {
		return this.upvotes - this.downvotes;
	});

	schema.methods.remaining = function(start) {
		if (!this.duration) return 0;

		var end = Date.parse(start) + (this.duration * 1000);
		var now = Date.now();

		return end - now;
	};

	return mongoose.model(name, schema);
}
