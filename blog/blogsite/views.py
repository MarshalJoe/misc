from django.shortcuts import render

# Create your views here.

from django.shortcuts import render, get_object_or_404
from blogsite.models import Post

def index(request):
	# get the blog posts that are published
	posts = Post.objects.filter(published=True)
	# now return the rendered template
	return render(request, 'blogsite/index.html', {'posts': posts})

def post(request, slug):
	# get the Post object
	post = get_object_or_404(Post, slug=slug)
	# now return the rendered template
	return render(request, 'blogsite/post.html', {'post': post})