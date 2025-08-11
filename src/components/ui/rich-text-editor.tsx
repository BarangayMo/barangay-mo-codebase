
import React, { useState } from 'react';
import { Button } from './button';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  AlignLeft,
  Image,
  Video,
  Youtube,
  Code
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor = ({ value, onChange, placeholder, className }: RichTextEditorProps) => {
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showYoutubeDialog, setShowYoutubeDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const insertImage = () => {
    if (imageUrl) {
      const imgTag = `<img src="${imageUrl}" alt="Product image" style="max-width: 100%; height: auto;" />`;
      onChange(value + imgTag);
      setImageUrl('');
      setShowImageDialog(false);
    }
  };

  const insertVideo = () => {
    if (videoUrl) {
      const videoTag = `<video controls style="max-width: 100%; height: auto;"><source src="${videoUrl}" type="video/mp4">Your browser does not support the video tag.</video>`;
      onChange(value + videoTag);
      setVideoUrl('');
      setShowVideoDialog(false);
    }
  };

  const insertYoutube = () => {
    if (youtubeUrl) {
      const videoId = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      if (videoId) {
        const embedTag = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="max-width: 100%;"></iframe>`;
        onChange(value + embedTag);
      }
      setYoutubeUrl('');
      setShowYoutubeDialog(false);
    }
  };

  const formatText = (tag: string) => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      const selectedText = selection.toString();
      const formattedText = `<${tag}>${selectedText}</${tag}>`;
      onChange(value.replace(selectedText, formattedText));
    }
  };

  return (
    <div className={cn("border rounded-md", className)}>
      <div className="flex items-center justify-between space-x-2 px-3 py-2 border-b bg-gray-50">
        <div className="flex items-center space-x-1">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={() => formatText('strong')}
            type="button"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={() => formatText('em')}
            type="button"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={() => formatText('u')}
            type="button"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={() => formatText('a')}
            type="button"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={() => formatText('ul')}
            type="button"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={() => formatText('p')}
            type="button"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>

          <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" type="button">
                <Image className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert Image</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <Button onClick={insertImage}>Insert Image</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" type="button">
                <Video className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert Video</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <Input
                    id="videoUrl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
                <Button onClick={insertVideo}>Insert Video</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showYoutubeDialog} onOpenChange={setShowYoutubeDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" type="button">
                <Youtube className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert YouTube Video</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="youtubeUrl">YouTube URL</Label>
                  <Input
                    id="youtubeUrl"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <Button onClick={insertYoutube}>Insert YouTube Video</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsCodeMode(!isCodeMode)}
          className="h-8 px-2"
          type="button"
        >
          <Code className="h-4 w-4 mr-1" />
          {isCodeMode ? 'Visual' : 'Code'}
        </Button>
      </div>

      {isCodeMode ? (
        <Textarea
          value={value}
          dir="ltr"
          onChange={(e) => onChange(e.target.value)}
          style={{ direction: 'ltr', unicodeBidi: 'bidi-override', textAlign: 'left' }}
          className="border-0 resize-none min-h-[120px] focus-visible:ring-0 font-mono text-sm"
          placeholder={placeholder}
        />
      ) : (
        <div className="min-h-[120px] p-3">
          <div
            contentEditable
            dir="ltr"
            className="min-h-[96px] outline-none"
            dangerouslySetInnerHTML={{ __html: value }}
            onInput={(e) => onChange(e.currentTarget.innerHTML)}
            style={{ whiteSpace: 'pre-wrap', direction: 'ltr', unicodeBidi: 'bidi-override', textAlign: 'left' }}
          />
          {!value && (
            <div className="text-muted-foreground pointer-events-none">
              {placeholder}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
