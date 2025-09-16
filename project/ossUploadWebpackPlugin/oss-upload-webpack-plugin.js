const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

class OSSUploadWebpackPlugin {
  constructor(options = {}) {
    this.options = options;
    this.ossClient = new OSS({
      region: options.region,
      accessKeyId: options.accessKeyId,
      accessKeySecret: options.accessKeySecret,
      bucket: options.bucket,
    });
  }

  apply(compiler) {
    // 在资源输出到输出目录后执行上传
    compiler.hooks.afterEmit.tapPromise(
      'OSSUploadWebpackPlugin',
      async (compilation) => {
        const { assets } = compilation;
        const imageExtensions = [
          '.png',
          '.jpg',
          '.jpeg',
          '.gif',
          '.svg',
          '.webp',
          '.bmp',
          '.ico',
        ];

        // 筛选出图片资源
        const imageAssets = Object.keys(assets).filter((assetPath) => {
          const ext = path.extname(assetPath).toLowerCase();
          return imageExtensions.includes(ext);
        });

        console.log(`Found ${imageAssets.length} image assets to upload`);

        // 上传所有图片到OSS
        for (const assetPath of imageAssets) {
          const localFilePath = path.resolve(
            compilation.outputOptions.path,
            assetPath
          );

          if (fs.existsSync(localFilePath)) {
            try {
              // 确定OSS上的路径
              let ossPath = assetPath;
              if (this.options.path) {
                ossPath = path
                  .join(this.options.path, assetPath)
                  .replace(/\\/g, '/');
              }

              // 获取MIME类型
              const mimeType =
                mime.lookup(assetPath) || 'application/octet-stream';

              // 上传文件
              const result = await this.ossClient.put(ossPath, localFilePath, {
                headers: {
                  'Content-Type': mimeType,
                },
              });

              console.log(`Uploaded ${assetPath} to OSS: ${result.url}`);

              // 记录上传信息，供后续替换使用
              compilation.ossUploads = compilation.ossUploads || {};
              compilation.ossUploads[assetPath] = this.options.customDomain
                ? `${this.options.customDomain}/${ossPath}`
                : result.url;
            } catch (error) {
              console.error(`Failed to upload ${assetPath} to OSS:`, error);
            }
          }
        }
      }
    );

    // 修改资源URL（如果需要）
    compiler.hooks.compilation.tap('OSSUploadWebpackPlugin', (compilation) => {
      // 处理HTML中的图片引用
      if (compilation.hooks.htmlWebpackPluginAfterHtmlProcessing) {
        compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
          'OSSUploadWebpackPlugin',
          (data, cb) => {
            if (compilation.ossUploads) {
              Object.keys(compilation.ossUploads).forEach((localPath) => {
                const ossUrl = compilation.ossUploads[localPath];
                const regex = new RegExp(localPath.replace(/\./g, '\\.'), 'g');
                data.html = data.html.replace(regex, ossUrl);
              });
            }
            cb(null, data);
          }
        );
      }

      // 处理CSS中的图片引用
      compilation.hooks.afterOptimizeAssets.tap(
        'OSSUploadWebpackPlugin',
        (assets) => {
          if (compilation.ossUploads) {
            Object.keys(assets).forEach((assetName) => {
              if (assetName.endsWith('.css')) {
                let content = assets[assetName].source();
                Object.keys(compilation.ossUploads).forEach((localPath) => {
                  const ossUrl = compilation.ossUploads[localPath];
                  const regex = new RegExp(
                    localPath.replace(/\./g, '\\.'),
                    'g'
                  );
                  content = content.replace(regex, ossUrl);
                });
                assets[assetName].source = () => content;
              }
            });
          }
        }
      );
    });
  }
}

module.exports = OSSUploadWebpackPlugin;
