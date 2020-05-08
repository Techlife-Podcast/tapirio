const Compiler = require('./compiler');
const info = require('../content/preferences.json');

class MarkdownBlog {
  constructor(path) {
    this.posts_ = [];
    this.info = info;
    this.path = path;
    this.compiler_ =  new Compiler(path);
    this.compiler_.compileAll();
    this.getPosts();
  }

  init() {
    return new Promise((resolve) => {
      this.resolve_ = resolve;
    });
  }

  async listFiles() {
    try {
      return await fs.readdir(this.path);
    } catch (err) {
      console.error('Error occured while reading directory', err);
    }
  }

  get posts() {
    return this.posts_;
  }

  async getPosts() {
    if (this.posts_.length > 0) {
      return this.posts_;
    }

    this.posts_ = await this.compiler_.listMeta();

    if (this.resolve_) this.resolve_();
    
    return this.posts_;
  }
  
  getPostMetadata(slug) {
    return this.posts_.find(a => a.slug === slug);
  }
  
  async renderMarkdown(slug) {
    return await this.compiler_.renderContent(slug + '.xml');
  }
  // outside blog.sortBy("date", true)
  // inside this class this.sortBy("date", true)
  sortBy(props) {
    let asc = 1; // ascending true, default
    if(props.asc !== undefined) {
      asc = props.asc ? 1 : -1;
    } 
    const field = props.property;

    if (field === 'date') {
      this.posts_ = this.posts_.sort((a, b) => {
        const alc = new Date(a[field]);
        const blc = new Date(b[field]);
        return alc > blc ? 1 * asc : -1 * asc;
      });
    } else {
      this.posts_ = this.posts_.sort((a, b) => {
        const alc = a[field].toLowerCase();
        const blc = b[field].toLowerCase();
        return alc > blc ? -1 * asc : alc < blc ? 1 * asc : 0;
      });
    }

    return this;
  }  
}

function throwError(message) {
  console.error("You messed up the file names. 😅");
  console.error(message);
  process.exit();
}

module.exports = MarkdownBlog;