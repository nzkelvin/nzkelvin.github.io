---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
---

  <div class="row">
    <div class="eight columns">
      {% for post in paginator.posts limit: 3 %}
      <h3><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></h3>

      <div class="row">
        <div class="twelve columns">
          {{ post.content }}
        </div>
      </div>
      {% endfor %}

      <div class="pagination">
      <p>
        {% if paginator.previous_page %}
          {% if paginator.previous_page == 1 %}
            <a href="/" class="previous">Previous</a>
          {% else %}
            <a href="{{ site.baseurl }}/page{{ paginator.previous_page }}" class="previous">Previous</a>
          {% endif %}
        {% else %}
          <span class="previous">Previous</span>
        {% endif %}
        <span class="page_number">Page: {{ paginator.page }} of {{ paginator.total_pages }}</span>
        {% if paginator.next_page %}
          <a href="{{ site.baseurl }}/page{{ paginator.next_page }}" class="next">Next</a>
        {% else %}
          <span class="next">Next</span>
        {% endif %}
      </p>
    </div>
    </div>
    <div class="four columns">
      <h4>Recent Writings</h4>
      <p>From the archives of this journal:</p>
      <ul class="disc">
      {% for post in site.posts offset: 3 limit: 10 %}
        <li><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></li>
      {% endfor %}
      </ul>
      <h4>About Edward Hyde</h4>
      <p>A night owl, citizen of London, of questionable character.</p>
      <p><a href="/feed.xml">Subscribe to Feed</a></p>
    </div>
  </div>
