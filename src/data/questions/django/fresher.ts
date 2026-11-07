import { defineQuestions } from "../author"
import { q } from "../compact"

const D = "https://docs.djangoproject.com/en/stable"
const R = "https://www.django-rest-framework.org"

export default defineQuestions("django", "fresher", [
  q({
    slug: "django-orm-models-and-crud",
    topic: "ORM",
    d: "easy",
    title:
      "What is the Django ORM, and how do you create, read, update and delete records?",
    kw: ["django orm", "models", "queryset", "crud", "objects manager"],
    intent: "Checks the basics of Django's data layer.",
    short:
      "The Django ORM maps Python classes (models) to database tables and lets you work with rows as objects without writing SQL. A model class with fields such as `CharField` or `ForeignKey` becomes a table after migrations. Each model has a default manager, `objects`, to start queries: `Book.objects.create(title='X')` inserts, `Book.objects.get(pk=1)` returns one object, `Book.objects.filter(year__gte=2020)` returns a QuerySet, `book.save()` writes changes, and `book.delete()` removes the row. Field lookups such as `__contains` and `__gte` express conditions, and the same code works across supported database backends.",
    detail: [
      "`get()` raises an exception when no object or several objects match.",
      "`QuerySet.update()` and `.delete()` act on many rows in one statement.",
      "You can still run raw SQL when needed.",
    ],
    ex: "A blog `Post` model with `title`, `body` and `published_at`, queried by `Post.objects.filter(published_at__isnull=False)`.",
    code: [
      [
        "Model and CRUD",
        "python",
        `from django.db import models\n\nclass Book(models.Model):\n    title = models.CharField(max_length=200)\n    year = models.IntegerField()\n\n# after makemigrations and migrate\nb = Book.objects.create(title="Dune", year=1965)\nBook.objects.filter(year__lt=1970)      # QuerySet\nb.title = "Dune (1965)"\nb.save()\nb.delete()`,
        [
          "The class defines the table.",
          "`objects` is the entry point for queries.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting to run migrations after changing models.",
      "Calling get() when several rows may match.",
    ],
    follow: ["What is the difference between get and filter?"],
    points: [
      "Models map to tables",
      "objects manager starts queries",
      "filter returns a QuerySet",
      "save and delete change rows",
    ],
    notes: ["Python objects instead of SQL."],
    src: [
      ["Django: Making queries", `${D}/topics/db/queries/`],
      ["Django: Models", `${D}/topics/db/models/`],
    ],
  }),
  q({
    slug: "queryset-lazy-evaluation-and-caching",
    topic: "ORM",
    d: "medium",
    title:
      "Why are Django QuerySets called lazy, and when do they hit the database?",
    kw: [
      "lazy queryset",
      "queryset evaluation",
      "queryset cache",
      "exists count",
      "iterator",
    ],
    intent: "Checks understanding of when queries run.",
    short:
      "Creating or chaining a QuerySet, such as `Book.objects.filter(...).order_by(...)`, does not touch the database; Django builds the SQL and runs it only when the QuerySet is evaluated: by iterating over it, slicing with a step, calling `len()`, `list()` or `bool()`, or printing it. After evaluation the results are cached in that QuerySet object, so iterating it again reuses them instead of querying again. Use `.exists()` to test for rows and `.count()` for a number rather than loading everything, and `.iterator()` to stream a very large result without caching. Laziness lets you compose filters across code without extra queries.",
    detail: [
      "Indexing a single item such as `qs[0]` runs a query with a LIMIT.",
      "Each new filter on a QuerySet returns a new QuerySet and does not reuse the cache.",
      "Use `django-debug-toolbar` or `connection.queries` to see the queries actually run.",
    ],
    ex: "A view builds a filtered QuerySet, passes it to the template, and the query runs once when the template loops over it.",
    code: [
      [
        "Lazy until used",
        "python",
        `qs = Book.objects.filter(year__gt=2000)   # no query yet\nqs = qs.order_by("title")                 # still no query\nfor b in qs:                              # query runs here\n    print(b.title)\nlist(qs)                                  # served from the cache`,
        ["Chaining only builds the query.", "Iteration evaluates and caches."],
      ],
    ],
    mistakes: [
      "Using len(qs) when count() is enough.",
      "Assuming each loop over the same QuerySet re-queries.",
    ],
    follow: ["How do you check if any rows exist cheaply?"],
    points: [
      "Lazy until evaluated",
      "Iteration, len, list, bool evaluate",
      "Results are cached on the object",
      "Use exists and count",
    ],
    notes: ["Build first, query later."],
    src: [
      ["Django: QuerySets are lazy", `${D}/topics/db/queries/`],
      ["Django: QuerySet API reference", `${D}/ref/models/querysets/`],
    ],
  }),
  q({
    slug: "n-plus-one-select-related-prefetch-related",
    topic: "ORM",
    d: "medium",
    title:
      "What is the N+1 query problem, and how do `select_related` and `prefetch_related` fix it?",
    kw: [
      "n+1 queries",
      "select_related",
      "prefetch_related",
      "query optimization",
      "joins",
    ],
    intent: "A frequent performance question for Django developers.",
    short:
      "The N+1 problem happens when you load N objects with one query and then access a related object on each, causing one additional query per object. Looping over 100 books and printing `book.author.name` runs 101 queries. `select_related('author')` follows ForeignKey and OneToOne relations with a SQL JOIN so the related rows come in the same query. `prefetch_related('tags')` runs one extra query for the related set and joins the results in Python, which suits many-to-many and reverse foreign-key relations. A `Prefetch` object customises the related QuerySet. Check the query count in tests or with debug tooling.",
    detail: [
      "`select_related` is for single-valued relations; `prefetch_related` for multi-valued ones.",
      "Use `only()` or `defer()` with care to avoid loading big columns.",
      "`assertNumQueries` in tests guards against regressions.",
    ],
    ex: "A book list page that went from 101 queries to 2 after adding `select_related('author')`.",
    code: [
      [
        "Avoiding N+1",
        "python",
        `# 1 + N queries\nfor b in Book.objects.all():\n    print(b.author.name)\n\n# 1 query with a JOIN\nfor b in Book.objects.select_related("author"):\n    print(b.author.name)\n\n# 2 queries for many-to-many\nBook.objects.prefetch_related("tags")`,
        ["The related object is fetched once, not per row."],
      ],
    ],
    mistakes: [
      "Accessing relations in a loop without preloading them.",
      "Using select_related on many-valued relations.",
    ],
    follow: ["When would you use prefetch_related instead of select_related?"],
    points: [
      "One query per related object is N+1",
      "select_related uses JOINs",
      "prefetch_related uses extra queries",
      "assertNumQueries in tests",
    ],
    notes: ["Load related data up front."],
    src: [
      ["Django: select_related", `${D}/ref/models/querysets/`],
      ["Django: Database access optimization", `${D}/topics/db/optimization/`],
    ],
  }),
  q({
    slug: "q-objects-f-expressions-lookups",
    topic: "ORM",
    d: "medium",
    title: "How do `Q` objects and `F` expressions extend ORM queries?",
    kw: [
      "Q object",
      "F expression",
      "OR query",
      "field lookups",
      "atomic update",
    ],
    intent: "Checks building complex conditions and database-side updates.",
    short:
      "Keyword arguments to `filter()` are ANDed together. `Q` objects let you build OR and NOT conditions and combine them with `|`, `&` and `~`: `Book.objects.filter(Q(year__lt=1950) | Q(title__startswith='A'))`. An `F` expression refers to the value of a model field inside the database, so you can compare two columns (`filter(sold__gt=F('stock'))`) or update a value without reading it into Python: `Product.objects.filter(pk=1).update(stock=F('stock') - 1)`. This runs as a single SQL update and avoids race conditions that arise from read-modify-write in Python.",
    detail: [
      "After an update with `F` on an instance, call `refresh_from_db()` to see the new value.",
      "Lookups such as `__icontains`, `__in` and `__range` cover most conditions.",
      "Combine `Q` objects dynamically to build search filters.",
    ],
    ex: "Decrementing stock with `F` so two simultaneous orders do not overwrite each other.",
    code: [
      [
        "Q and F",
        "python",
        `from django.db.models import F, Q\n\nBook.objects.filter(Q(year__lt=1950) | Q(title__startswith="A"))\nBook.objects.exclude(Q(year__isnull=True))\nProduct.objects.filter(pk=1).update(stock=F("stock") - 1)`,
        ["`|` builds an OR.", "`F` makes the database do the arithmetic."],
      ],
    ],
    mistakes: [
      "Doing read-modify-write in Python for counters.",
      "Expecting kwargs in filter() to mean OR.",
    ],
    follow: ["Why does F avoid a race condition?"],
    points: [
      "Q for OR and NOT",
      "F refers to a column in SQL",
      "F updates are atomic in one statement",
      "refresh_from_db after F",
    ],
    notes: ["Let the database compute."],
    src: [
      ["Django: Complex lookups with Q objects", `${D}/topics/db/queries/`],
      ["Django: F() expressions", `${D}/ref/models/expressions/`],
    ],
  }),
  q({
    slug: "aggregate-annotate-values",
    topic: "ORM",
    d: "medium",
    title:
      "What is the difference between `aggregate()` and `annotate()` in Django?",
    kw: ["aggregate", "annotate", "group by", "Count", "values"],
    intent: "Checks summarising data with the ORM.",
    short:
      "`aggregate()` computes summary values over the whole QuerySet and returns a dictionary: `Book.objects.aggregate(avg=Avg('price'), n=Count('id'))`. `annotate()` adds a computed value to each object in the QuerySet, such as a count of related rows: `Author.objects.annotate(num_books=Count('book'))`, and each author then has a `num_books` attribute. Combining `values('field')` before `annotate()` groups the rows by that field, like SQL `GROUP BY`. Annotations can be used in `filter()` and `order_by()` afterwards. The calculations run in the database, which is faster than looping in Python.",
    detail: [
      "The order of `values()` and `annotate()` changes the grouping.",
      "`Count('book', distinct=True)` avoids double counting across joins.",
      "`Sum`, `Avg`, `Min`, `Max` and `Count` are the standard aggregates.",
    ],
    ex: "Listing authors with their book counts and ordering by the most books.",
    code: [
      [
        "Aggregate and annotate",
        "python",
        `from django.db.models import Avg, Count\n\nBook.objects.aggregate(avg=Avg("price"))              # {'avg': ...}\nAuthor.objects.annotate(n=Count("book")).order_by("-n")\nBook.objects.values("year").annotate(c=Count("id"))     # group by year`,
        ["`aggregate` returns one dict.", "`annotate` adds a field per row."],
      ],
    ],
    mistakes: [
      "Looping in Python to compute totals.",
      "Double counting from multiple joins without distinct.",
    ],
    follow: ["How do you group rows by a column?"],
    points: [
      "aggregate: one summary dict",
      "annotate: value per object",
      "values then annotate = GROUP BY",
      "Computed in the database",
    ],
    notes: ["Summaries in SQL."],
    src: [
      ["Django: Aggregation", `${D}/topics/db/aggregation/`],
      [
        "Django: QuerySet API (annotate and aggregate)",
        `${D}/ref/models/querysets/`,
      ],
    ],
  }),
  q({
    slug: "migrations-workflow",
    topic: "ORM",
    d: "medium",
    title:
      "How do Django migrations work, and what is the difference between `makemigrations` and `migrate`?",
    kw: [
      "migrations",
      "makemigrations",
      "migrate",
      "schema changes",
      "data migration",
    ],
    intent: "Checks the schema change workflow.",
    short:
      "Migrations are Django's version control for the database schema. After you change models, `python manage.py makemigrations` inspects them and writes a migration file describing the change; `python manage.py migrate` applies unapplied migrations to the database and records them in the `django_migrations` table. Commit migration files with your code so every environment applies the same steps. `showmigrations` lists their state and `sqlmigrate` prints the SQL. Data changes use `RunPython` operations in a migration. Avoid editing applied migrations; create a new one instead, and be careful with dependencies when several developers add migrations on different branches.",
    detail: [
      "`squashmigrations` combines a long history into fewer files.",
      "Add columns as nullable or with defaults to keep deployments safe on large tables.",
      "Migrations run per app and can depend on other apps' migrations.",
    ],
    ex: "Adding a `published` field, running `makemigrations`, reviewing the file and running `migrate` in each environment.",
    mistakes: [
      "Not committing migration files.",
      "Editing a migration that has already been applied elsewhere.",
    ],
    follow: ["How do you see the SQL a migration will run?"],
    points: [
      "makemigrations writes files",
      "migrate applies them",
      "Commit migrations",
      "RunPython for data changes",
    ],
    notes: ["Generate, review, apply."],
    src: [
      ["Django: Migrations", `${D}/topics/migrations/`],
      ["Django: django-admin commands", `${D}/ref/django-admin/`],
    ],
  }),
  q({
    slug: "model-relationships-and-on-delete",
    topic: "ORM",
    d: "easy",
    title:
      "Which relationship fields does Django offer, and what does `on_delete` do?",
    kw: [
      "ForeignKey",
      "OneToOneField",
      "ManyToManyField",
      "on_delete",
      "related_name",
    ],
    intent: "Checks modelling of relations.",
    short:
      "`ForeignKey` models many-to-one (many books, one author), `OneToOneField` models a unique one-to-one link (user and profile), and `ManyToManyField` models many-to-many (books and tags) through an intermediate table, which you can customise with `through`. Every `ForeignKey` requires `on_delete` to say what happens when the referenced row is deleted: `CASCADE` deletes dependants, `PROTECT` and `RESTRICT` prevent deletion, `SET_NULL` and `SET_DEFAULT` replace the value, and `DO_NOTHING` leaves it to the database. The reverse accessor defaults to `<model>_set`; `related_name` gives it a friendlier name.",
    detail: [
      "`SET_NULL` needs `null=True` on the field.",
      "A custom `through` model can store extra data about the relationship.",
      "Choose `on_delete` deliberately: `CASCADE` can delete a lot of data.",
    ],
    ex: "`Book.author = ForeignKey(Author, on_delete=models.CASCADE, related_name='books')` lets you write `author.books.all()`.",
    mistakes: [
      "Using CASCADE everywhere without thinking.",
      "Forgetting null=True with SET_NULL.",
    ],
    follow: ["What does related_name change?"],
    points: [
      "ForeignKey many-to-one",
      "OneToOne unique link",
      "ManyToMany with optional through model",
      "on_delete is required",
    ],
    notes: ["Decide what happens on delete."],
    src: [
      [
        "Django: Model field reference (relationships)",
        `${D}/ref/models/fields/`,
      ],
      ["Django: Models - relationships", `${D}/topics/db/models/`],
    ],
  }),
  q({
    slug: "transactions-atomic-and-select-for-update",
    topic: "ORM",
    d: "hard",
    title:
      "How do database transactions work in Django (`atomic`, `ATOMIC_REQUESTS`, `select_for_update`)?",
    kw: [
      "transaction.atomic",
      "ATOMIC_REQUESTS",
      "select_for_update",
      "on_commit",
      "autocommit",
    ],
    intent: "Checks data consistency practices.",
    short:
      "By default Django runs in autocommit mode: each query is committed immediately. To make several changes all-or-nothing, wrap them in `transaction.atomic()` (a decorator or context manager); if an exception leaves the block, everything inside is rolled back. Setting `ATOMIC_REQUESTS = True` wraps each view in a transaction. `select_for_update()` locks the selected rows until the transaction ends, preventing concurrent updates on them, and it must be used inside a transaction. Use `transaction.on_commit(func)` to run side effects, like sending an email or queuing a task, only after the data is really committed.",
    detail: [
      "Do not catch database errors inside an `atomic` block without a nested `atomic`, or the transaction is left in a broken state.",
      "Keep transactions short to reduce lock contention.",
      "Not every database supports every locking option.",
    ],
    ex: "Transferring money: debit one account and credit another inside one `atomic` block.",
    code: [
      [
        "atomic transfer",
        "python",
        `from django.db import transaction\n\n@transaction.atomic\ndef transfer(src_id, dst_id, amount):\n    src = Account.objects.select_for_update().get(pk=src_id)\n    dst = Account.objects.select_for_update().get(pk=dst_id)\n    src.balance -= amount\n    dst.balance += amount\n    src.save()\n    dst.save()`,
        [
          "Both saves commit together or not at all.",
          "Row locks prevent concurrent changes.",
        ],
      ],
    ],
    mistakes: [
      "Sending emails inside the transaction before it commits.",
      "Swallowing exceptions inside atomic.",
    ],
    follow: ["What does on_commit solve?"],
    points: [
      "Autocommit by default",
      "atomic gives all-or-nothing",
      "select_for_update locks rows",
      "on_commit for side effects",
    ],
    notes: ["All or nothing."],
    src: [
      ["Django: Database transactions", `${D}/topics/db/transactions/`],
      ["Django: select_for_update", `${D}/ref/models/querysets/`],
    ],
  }),
  q({
    slug: "get-doesnotexist-and-get-object-or-404",
    topic: "ORM",
    d: "easy",
    title:
      "What happens when `get()` finds no row or several rows, and what is `get_object_or_404`?",
    kw: [
      "DoesNotExist",
      "MultipleObjectsReturned",
      "get_object_or_404",
      "first",
      "filter exists",
    ],
    intent: "Checks safe retrieval of single objects.",
    short:
      "`Model.objects.get(...)` must match exactly one row. If none match it raises `Model.DoesNotExist`, and if several match it raises `Model.MultipleObjectsReturned`. In a view, `get_object_or_404(Model, pk=pk)` from `django.shortcuts` turns the missing case into an HTTP 404 response, which is usually what you want for a URL that refers to a record. To get 'the first match or nothing' use `filter(...).first()`, which returns `None`. Use `filter(...).exists()` when you only need to know whether something exists. Catch `DoesNotExist` when absence is an expected case.",
    detail: [
      "`get_or_create()` returns `(object, created)` and handles races when a unique constraint exists.",
      "A unique field makes `get()` safe from `MultipleObjectsReturned`.",
      "`first()` orders by primary key if the QuerySet is unordered.",
    ],
    ex: "A detail view uses `get_object_or_404(Post, slug=slug)` so unknown slugs show a 404 page.",
    mistakes: [
      "Letting DoesNotExist cause a 500 error.",
      "Using get() on non-unique fields.",
    ],
    follow: ["What does first() return when nothing matches?"],
    points: [
      "get needs exactly one match",
      "DoesNotExist and MultipleObjectsReturned",
      "get_object_or_404 for views",
      "first() returns None",
    ],
    notes: ["Exactly one, or an exception."],
    src: [
      [
        "Django: django.shortcuts get_object_or_404",
        `${D}/topics/http/shortcuts/`,
      ],
      [
        "Django: QuerySet API (get, first, exists)",
        `${D}/ref/models/querysets/`,
      ],
    ],
  }),
  q({
    slug: "bulk-operations-and-update-versus-save",
    topic: "ORM",
    d: "medium",
    title:
      "How do `bulk_create`, `bulk_update` and `update()` differ from calling `save()` in a loop?",
    kw: [
      "bulk_create",
      "bulk_update",
      "queryset update",
      "signals not sent",
      "batch size",
    ],
    intent: "Checks efficient writes and their trade-offs.",
    short:
      "Calling `save()` for thousands of objects issues one query each. `bulk_create(objs)` inserts many rows in few queries, `bulk_update(objs, fields)` updates chosen fields for many objects, and `QuerySet.update(field=value)` changes all matching rows in one SQL statement. They are much faster, but come with caveats the documentation lists: a model's `save()` method is not called and the `pre_save`/`post_save` signals are not sent, `auto_now` fields on `update()` are not refreshed, and `bulk_create` may not set primary keys on every database backend. Use `batch_size` for very large lists.",
    detail: [
      "Validation (`full_clean`) is not run by these methods.",
      "Use `update_or_create` and `get_or_create` for single-row upserts.",
      "Wrap bulk writes in a transaction when they must succeed together.",
    ],
    ex: "Importing 50,000 rows with `bulk_create(rows, batch_size=1000)` instead of 50,000 `save()` calls.",
    mistakes: [
      "Expecting signals or custom save() logic to run.",
      "Looping save() for large imports.",
    ],
    follow: ["What do bulk operations skip?"],
    points: [
      "Fewer queries",
      "save() and signals not called",
      "update() changes many rows in one statement",
      "batch_size for big lists",
    ],
    notes: ["Fast, but they skip hooks."],
    src: [
      ["Django: bulk_create and bulk_update", `${D}/ref/models/querysets/`],
      [
        "Django: Database access optimization (bulk methods)",
        `${D}/topics/db/optimization/`,
      ],
    ],
  }),
  q({
    slug: "raw-sql-parameters-and-injection",
    topic: "ORM",
    d: "medium",
    title: "How do you run raw SQL in Django safely?",
    kw: ["raw sql", "sql injection", "cursor.execute", "params", "Manager.raw"],
    intent: "Checks safe handling of SQL escape hatches.",
    short:
      "The ORM protects against SQL injection by parameterising queries. When you need raw SQL, use `Model.objects.raw(sql, params)` to get model instances or `connection.cursor()` with `cursor.execute(sql, params)`, and always pass values through the `params` argument with `%s` placeholders: `cursor.execute('SELECT * FROM t WHERE id = %s', [user_id])`. Never build the SQL string with f-strings, `%` formatting or concatenation from user input, because that opens an injection hole. Placeholders are for values, not identifiers such as table or column names, which must come from a fixed whitelist.",
    detail: [
      "Prefer ORM features such as `annotate`, `Func` and database functions before dropping to raw SQL.",
      "`raw()` must select the primary key column for model instances.",
      "Add tests for raw queries; they are not portable across backends.",
    ],
    ex: "A report using a database-specific window function is run with `cursor.execute` and parameters.",
    code: [
      [
        "Parameterised SQL",
        "python",
        `from django.db import connection\n\ndef find(user_id):\n    with connection.cursor() as cursor:\n        cursor.execute("SELECT name FROM app_user WHERE id = %s", [user_id])\n        return cursor.fetchone()\n\n# NEVER: cursor.execute(f"... WHERE id = {user_id}")`,
        ["The driver escapes the value."],
      ],
    ],
    mistakes: [
      "Formatting SQL with f-strings.",
      "Using placeholders for table names.",
    ],
    follow: ["Why can't placeholders be used for column names?"],
    points: [
      "ORM parameterises by default",
      "Pass params, not formatted strings",
      "Placeholders are for values only",
      "Whitelist identifiers",
    ],
    notes: ["Parameters, always."],
    src: [
      ["Django: Performing raw SQL queries", `${D}/topics/db/sql/`],
      ["Django: Security (SQL injection protection)", `${D}/topics/security/`],
    ],
  }),
  q({
    slug: "function-based-versus-class-based-views",
    topic: "Views",
    d: "easy",
    title:
      "What is the difference between function-based and class-based views in Django?",
    kw: [
      "function based views",
      "class based views",
      "View.as_view",
      "mixins",
      "dispatch",
    ],
    intent: "Checks view styles and trade-offs.",
    short:
      "A function-based view is a plain function that takes a request and returns a response; it is explicit, easy to read and good for simple or unusual logic. A class-based view (CBV) is a class whose methods such as `get()` and `post()` handle HTTP methods, hooked up with `MyView.as_view()` in the URLconf. CBVs shine when you want to reuse behaviour through inheritance and mixins, and Django's generic views (`ListView`, `DetailView`, `CreateView`) implement common patterns with a few attributes. The cost is more indirection: you need to know which method to override. Both are fully supported, and many projects mix them.",
    detail: [
      "CBVs dispatch by HTTP method name, returning 405 for undefined methods.",
      "Decorators work on functions directly; for CBVs use `method_decorator` or mixins.",
      "Choose the style that keeps the code clearest.",
    ],
    ex: "A simple health-check endpoint as a function; list and detail pages as generic CBVs.",
    code: [
      [
        "Both styles",
        "python",
        `from django.http import HttpResponse\nfrom django.views import View\n\ndef hello(request):\n    return HttpResponse("hello")\n\nclass Hello(View):\n    def get(self, request):\n        return HttpResponse("hello")\n\n# urls.py: path("a/", hello), path("b/", Hello.as_view())`,
        ["The class method name matches the HTTP method."],
      ],
    ],
    mistakes: [
      "Forgetting .as_view() in urls.",
      "Overriding methods without calling super().",
    ],
    follow: ["When would you pick a generic CBV?"],
    points: [
      "FBV: function request → response",
      "CBV: methods per HTTP verb",
      "as_view() in the URLconf",
      "Generics reduce boilerplate",
    ],
    notes: ["Function for simple, class for reuse."],
    src: [
      ["Django: Writing views", `${D}/topics/http/views/`],
      ["Django: Class-based views", `${D}/topics/class-based-views/`],
    ],
  }),
  q({
    slug: "urlconf-request-response-cycle",
    topic: "Views",
    d: "easy",
    title: "How does Django route a request to a view?",
    kw: ["urlconf", "path", "include", "reverse", "request response cycle"],
    intent: "Checks the request path through Django.",
    short:
      "The web server hands the request to Django (WSGI or ASGI). Django builds an `HttpRequest`, passes it down the middleware chain, and resolves the URL against the `ROOT_URLCONF`. Patterns are written with `path('articles/<int:year>/', views.year_archive, name='year')`, and `include('app.urls')` delegates a prefix to an app's URLconf. The first matching pattern selects the view, which receives the request and captured parameters and returns an `HttpResponse`; the response travels back up through the middleware. Naming URLs lets you use `reverse('year', args=[2026])` and `{% url 'year' 2026 %}` instead of hard-coding paths.",
    detail: [
      "Path converters such as `int`, `str`, `slug` and `uuid` validate and convert parts of the URL.",
      "No match produces a 404.",
      "`re_path` supports regular expressions when converters are not enough.",
    ],
    ex: "`path('', include('blog.urls'))` mounts a blog app at the site root.",
    code: [
      [
        "URLconf",
        "python",
        `from django.urls import path\nfrom . import views\n\nurlpatterns = [\n    path("articles/<int:year>/", views.year_archive, name="year"),\n    path("articles/<slug:slug>/", views.detail, name="detail"),\n]`,
        ["`name` enables reverse lookups.", "Converters pass typed arguments."],
      ],
    ],
    mistakes: [
      "Hard-coding URLs instead of reversing them.",
      "Putting a catch-all pattern before specific ones.",
    ],
    follow: ["What does reverse() do?"],
    points: [
      "Middleware then URL resolution",
      "path and include",
      "First match wins",
      "Name URLs and reverse them",
    ],
    notes: ["URL pattern to view to response."],
    src: [
      ["Django: URL dispatcher", `${D}/topics/http/urls/`],
      ["Django: Request and response objects", `${D}/ref/request-response/`],
    ],
  }),
  q({
    slug: "generic-class-based-views",
    topic: "Views",
    d: "medium",
    title:
      "How do Django's generic views like `ListView` and `DetailView` work?",
    kw: [
      "ListView",
      "DetailView",
      "get_queryset",
      "context_object_name",
      "generic views",
    ],
    intent: "Checks use of generic views and customisation points.",
    short:
      "Generic views implement common patterns. `ListView` shows a list of objects: set `model` (or `queryset`) and it renders a template named `<app>/<model>_list.html` by default, passing the objects as `object_list` or under the name given by `context_object_name`. `DetailView` shows one object found by `pk` or `slug`. Customise by setting attributes (`template_name`, `paginate_by`, `ordering`) or by overriding methods: `get_queryset()` to filter per user, `get_context_data()` to add template variables. `CreateView`, `UpdateView` and `DeleteView` handle forms and redirects. Combine with `LoginRequiredMixin` to restrict access.",
    detail: [
      "Put mixins before the view class in the inheritance list.",
      "Call `super().get_context_data(**kwargs)` before adding to the context.",
      "`paginate_by` adds pagination variables to the context.",
    ],
    ex: "A `ListView` showing only the logged-in user's orders by overriding `get_queryset()`.",
    code: [
      [
        "ListView",
        "python",
        `from django.views.generic import ListView\nfrom django.contrib.auth.mixins import LoginRequiredMixin\n\nclass MyOrders(LoginRequiredMixin, ListView):\n    model = Order\n    paginate_by = 20\n    def get_queryset(self):\n        return Order.objects.filter(user=self.request.user)`,
        [
          "The mixin comes first.",
          "`get_queryset` limits rows to the current user.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting to filter get_queryset by user.",
      "Wrong mixin order.",
    ],
    follow: ["What is the default template name for a ListView?"],
    points: [
      "Configure with attributes",
      "Override get_queryset and get_context_data",
      "Default template naming",
      "Mixins for access control",
    ],
    notes: ["Configure first, override second."],
    src: [
      [
        "Django: Built-in class-based generic views",
        `${D}/topics/class-based-views/generic-display/`,
      ],
      [
        "Django: Generic display views reference",
        `${D}/ref/class-based-views/generic-display/`,
      ],
    ],
  }),
  q({
    slug: "forms-modelforms-and-validation",
    topic: "Views",
    d: "medium",
    title: "How do Django forms and `ModelForm` handle validation?",
    kw: [
      "django forms",
      "ModelForm",
      "is_valid",
      "cleaned_data",
      "clean method",
    ],
    intent: "Checks the form validation flow.",
    short:
      "A `Form` class declares fields and their validation rules. In a view you bind submitted data (`form = ContactForm(request.POST)`), call `form.is_valid()`, and read validated, converted values from `form.cleaned_data`; if invalid, `form.errors` holds messages and re-rendering the form shows them. Add field-specific checks in `clean_<fieldname>()` and cross-field checks in `clean()`. A `ModelForm` generates fields from a model (`class Meta: model = Book; fields = [...]`) and `form.save()` creates or updates the instance. List the fields explicitly, and always redirect after a successful POST to avoid duplicate submissions on refresh.",
    detail: [
      "The `{% csrf_token %}` tag is required in POST forms.",
      "Validation also runs the model's field validators for `ModelForm`.",
      "Never trust `request.POST` directly; use the form's cleaned data.",
    ],
    ex: "A signup form that checks that the two password fields match in `clean()`.",
    code: [
      [
        "Form validation",
        "python",
        `from django import forms\n\nclass ContactForm(forms.Form):\n    email = forms.EmailField()\n    message = forms.CharField(min_length=10)\n\n    def clean_message(self):\n        msg = self.cleaned_data["message"]\n        if "spam" in msg.lower():\n            raise forms.ValidationError("No spam, please.")\n        return msg`,
        [
          "`clean_message` validates one field.",
          "Raise `ValidationError` to report a problem.",
        ],
      ],
    ],
    mistakes: [
      "Using request.POST values without validation.",
      "Using fields = '__all__' on forms that expose sensitive model fields.",
    ],
    follow: ["Where do cross-field checks go?"],
    points: [
      "is_valid then cleaned_data",
      "clean_<field> and clean()",
      "ModelForm builds from a model",
      "Redirect after POST",
    ],
    notes: ["Validate before using the data."],
    src: [
      ["Django: Working with forms", `${D}/topics/forms/`],
      ["Django: Creating forms from models", `${D}/topics/forms/modelforms/`],
    ],
  }),
  q({
    slug: "template-autoescaping-and-xss",
    topic: "Views",
    d: "easy",
    title: "How does Django's template system protect against XSS?",
    kw: ["autoescape", "xss", "safe filter", "mark_safe", "template security"],
    intent: "Checks safe output handling.",
    short:
      "Django templates automatically escape variable output, converting characters such as `<`, `>`, `&` and quotes into HTML entities, so user-supplied text like `<script>` is shown as text and not executed. This is on by default for `{{ variable }}`. The protection is disabled for a value only if you apply the `|safe` filter, wrap it in `mark_safe()`, or use `{% autoescape off %}`. Only do that for HTML you have produced or sanitised yourself, never for user input. Escaping also depends on context, so be careful when placing variables inside JavaScript or in attributes without quotes, and use `json_script` for passing data to scripts.",
    detail: [
      "`format_html()` builds safe HTML snippets with escaped arguments.",
      "A Content Security Policy adds another layer of defence.",
      "Rich text from users should be sanitised with a dedicated library.",
    ],
    ex: "A comment containing `<script>alert(1)</script>` is displayed as text.",
    mistakes: [
      "Applying |safe to user-provided content.",
      "Building HTML with string concatenation and mark_safe.",
    ],
    follow: ["How do you pass data from a view to JavaScript safely?"],
    points: [
      "Autoescape on by default",
      "|safe and mark_safe disable it",
      "Only for trusted HTML",
      "json_script for JS data",
    ],
    notes: ["Escape by default."],
    src: [
      ["Django: Automatic HTML escaping", `${D}/ref/templates/language/`],
      ["Django: Security (XSS protection)", `${D}/topics/security/`],
    ],
  }),
  q({
    slug: "middleware-basics-and-order",
    topic: "Middleware",
    d: "medium",
    title: "What is middleware in Django, and why does its order matter?",
    kw: [
      "middleware",
      "MIDDLEWARE setting",
      "get_response",
      "request response processing",
      "custom middleware",
    ],
    intent: "Checks understanding of the request/response pipeline.",
    short:
      "Middleware is a layer of hooks that processes every request and response globally, for things like sessions, authentication, CSRF protection and security headers. Each middleware is a callable built from `get_response`: code before calling `get_response(request)` runs on the way in, code after it runs on the way out. The `MIDDLEWARE` list defines the order: requests pass through the list from top to bottom, and responses back from bottom to top. Order matters because some middleware depends on others, for example `AuthenticationMiddleware` needs the session set up by `SessionMiddleware`, and `SecurityMiddleware` is recommended near the top. A middleware can also return a response early to short-circuit.",
    detail: [
      "Hooks like `process_view` and `process_exception` give finer control.",
      "Keep middleware fast, since it runs on every request.",
      "Prefer decorators or mixins for logic that only some views need.",
    ],
    ex: "A custom middleware measures request time and adds it to a response header.",
    code: [
      [
        "Custom middleware",
        "python",
        `import time\n\nclass TimingMiddleware:\n    def __init__(self, get_response):\n        self.get_response = get_response\n\n    def __call__(self, request):\n        start = time.perf_counter()\n        response = self.get_response(request)\n        response["X-Elapsed"] = f"{time.perf_counter() - start:.4f}"\n        return response`,
        [
          "Code before get_response runs on the way in.",
          "Code after it runs on the way out.",
        ],
      ],
    ],
    mistakes: [
      "Placing middleware in the wrong order.",
      "Doing slow work in global middleware.",
    ],
    follow: ["In which direction does a response travel through the list?"],
    points: [
      "Global request/response hooks",
      "Wraps get_response",
      "Order defined by MIDDLEWARE",
      "Can short-circuit",
    ],
    notes: ["An onion around the view."],
    src: [
      ["Django: Middleware", `${D}/topics/http/middleware/`],
      ["Django: Middleware reference", `${D}/ref/middleware/`],
    ],
  }),
  q({
    slug: "csrf-protection-in-django",
    topic: "Middleware",
    d: "medium",
    title: "How does Django protect against CSRF attacks?",
    kw: [
      "csrf",
      "csrf_token",
      "CsrfViewMiddleware",
      "csrf_exempt",
      "cross-site request forgery",
    ],
    intent: "Checks understanding of a core web security mechanism.",
    short:
      "Cross-site request forgery makes a logged-in user's browser send an unwanted request to your site. Django's `CsrfViewMiddleware` requires a secret token with unsafe methods (POST, PUT, PATCH, DELETE): templates include it with `{% csrf_token %}` inside forms, and JavaScript sends it in the `X-CSRFToken` header. A request without a valid token is rejected with 403, and a malicious site cannot read the token because of the browser's same-origin policy. Do not disable the protection; `@csrf_exempt` should be reserved for endpoints that use other safeguards, such as token-authenticated APIs. Safe methods like GET must not change state.",
    detail: [
      "The token is tied to the cookie or session.",
      "`CSRF_TRUSTED_ORIGINS` lists trusted cross-origin hosts.",
      "Token-based API authentication (headers) is not vulnerable to CSRF in the same way, because browsers do not attach it automatically.",
    ],
    ex: "A POST form that returns 403 because the template lacks `{% csrf_token %}`.",
    mistakes: [
      "Using csrf_exempt to silence errors.",
      "Changing data in GET requests.",
    ],
    follow: ["How does JavaScript send the token?"],
    points: [
      "Token required on unsafe methods",
      "{% csrf_token %} in forms",
      "X-CSRFToken header for AJAX",
      "Missing token gives 403",
    ],
    notes: ["Prove the request came from your page."],
    src: [
      ["Django: Cross Site Request Forgery protection", `${D}/ref/csrf/`],
      ["Django: Security overview", `${D}/topics/security/`],
    ],
  }),
  q({
    slug: "drf-serializers-explained",
    topic: "DRF",
    d: "medium",
    title: "What are serializers in Django REST framework?",
    kw: [
      "drf serializer",
      "ModelSerializer",
      "validated_data",
      "is_valid",
      "json conversion",
    ],
    intent: "A core DRF concept.",
    short:
      "A serializer converts complex data, such as model instances and QuerySets, into native Python types that can be rendered as JSON, and validates and converts incoming data back into Python objects. `ModelSerializer` builds fields and basic validation from a model through `class Meta: model = Book; fields = [...]`. For output you pass an instance (`BookSerializer(book).data`); for input you pass `data=request.data`, call `is_valid(raise_exception=True)` and then use `serializer.validated_data` or call `save()`, which runs `create()` or `update()`. Add field-level checks with `validate_<field>()` and object-level checks with `validate()`.",
    detail: [
      "Use `many=True` to serialise lists.",
      "Declare fields as `read_only` or `write_only` to control exposure.",
      "List fields explicitly rather than using `__all__` to avoid exposing new columns by accident.",
    ],
    ex: "An order serializer that validates quantities and hides internal cost fields.",
    code: [
      [
        "ModelSerializer",
        "python",
        `from rest_framework import serializers\n\nclass BookSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Book\n        fields = ["id", "title", "year"]\n\n    def validate_year(self, value):\n        if value < 0:\n            raise serializers.ValidationError("year must be positive")\n        return value`,
        [
          "`Meta.fields` lists what is exposed.",
          "`validate_year` checks one field.",
        ],
      ],
    ],
    mistakes: [
      "Using fields = '__all__' blindly.",
      "Skipping is_valid before accessing validated_data.",
    ],
    follow: ["How do you serialise a list of objects?"],
    points: [
      "Objects to JSON-ready data and back",
      "ModelSerializer from a model",
      "is_valid then save",
      "validate_<field> and validate()",
    ],
    notes: ["Convert and validate."],
    src: [
      ["DRF: Serializers", `${R}/api-guide/serializers/`],
      ["DRF: Serializer fields", `${R}/api-guide/fields/`],
    ],
  }),
  q({
    slug: "drf-viewsets-and-routers",
    topic: "DRF",
    d: "medium",
    title: "What are DRF viewsets and routers, and how do they reduce code?",
    kw: ["ViewSet", "ModelViewSet", "router", "DefaultRouter", "actions"],
    intent: "Checks use of DRF's high-level abstractions.",
    short:
      "A `ViewSet` groups related actions (`list`, `create`, `retrieve`, `update`, `destroy`) in one class rather than separate view classes. `ModelViewSet` provides all of them for a queryset and serializer: set `queryset` and `serializer_class` and you have a full CRUD API. A router then generates the URL patterns from the viewset: `router = DefaultRouter(); router.register('books', BookViewSet)`, giving `/books/` and `/books/{id}/` and, for `DefaultRouter`, an API root view. Add custom endpoints with the `@action` decorator. Use `ReadOnlyModelViewSet` for read-only resources, and override `get_queryset()` to limit data per user.",
    detail: [
      "`GenericViewSet` plus mixins lets you offer only some actions.",
      "Method names map to HTTP verbs through the router.",
      "Explicit APIView subclasses are easier to follow for unusual endpoints.",
    ],
    ex: "`router.register('orders', OrderViewSet)` creates list, detail, create, update and delete routes.",
    code: [
      [
        "ViewSet and router",
        "python",
        `from rest_framework import viewsets, routers\n\nclass BookViewSet(viewsets.ModelViewSet):\n    queryset = Book.objects.all()\n    serializer_class = BookSerializer\n\nrouter = routers.DefaultRouter()\nrouter.register("books", BookViewSet)\nurlpatterns = router.urls`,
        [
          "One class provides the whole CRUD API.",
          "The router builds the URLs.",
        ],
      ],
    ],
    mistakes: [
      "Exposing all objects without filtering by user.",
      "Using ModelViewSet when you want only a couple of actions.",
    ],
    follow: ["How do you add a custom endpoint to a viewset?"],
    points: [
      "ViewSet groups actions",
      "ModelViewSet gives CRUD",
      "Routers generate URLs",
      "@action for extras",
    ],
    notes: ["Class + router = API."],
    src: [
      ["DRF: ViewSets", `${R}/api-guide/viewsets/`],
      ["DRF: Routers", `${R}/api-guide/routers/`],
    ],
  }),
  q({
    slug: "drf-apiview-generic-viewset-choice",
    topic: "DRF",
    d: "medium",
    title:
      "How do you choose between `APIView`, generic views and viewsets in DRF?",
    kw: [
      "APIView",
      "GenericAPIView",
      "ListCreateAPIView",
      "viewset choice",
      "api design",
    ],
    intent: "Checks design judgement within DRF.",
    short:
      "`APIView` is the lowest-level class-based view: you write `get()`, `post()` and so on yourself and control everything, suited to endpoints that are not simple CRUD on one model. Generic views such as `ListCreateAPIView` and `RetrieveUpdateDestroyAPIView` combine `GenericAPIView` with mixins, so you only set `queryset` and `serializer_class`, and are a good middle ground for standard resource endpoints. Viewsets with routers go further by grouping all actions for a resource and generating URLs, giving the least code for conventional REST resources. Use the highest-level class that fits, and drop down when behaviour is unusual.",
    detail: [
      "Function-based views with `@api_view` are also available.",
      "All of these share authentication, permission and throttling settings.",
      "Mixing styles in one project is common.",
    ],
    ex: "An analytics endpoint as an `APIView`; products as a `ModelViewSet`.",
    mistakes: [
      "Fighting a viewset to make it behave like a custom endpoint.",
      "Re-implementing CRUD logic in APIView.",
    ],
    follow: ["When is APIView the better choice?"],
    points: [
      "APIView: full control",
      "Generic views: queryset + serializer",
      "Viewsets: least code for CRUD",
      "Use the highest level that fits",
    ],
    notes: ["Higher level when standard, lower when custom."],
    src: [
      ["DRF: Views", `${R}/api-guide/views/`],
      ["DRF: Generic views", `${R}/api-guide/generic-views/`],
    ],
  }),
  q({
    slug: "drf-authentication-and-permissions",
    topic: "DRF",
    d: "medium",
    title:
      "How do authentication and permissions work in Django REST framework?",
    kw: [
      "drf authentication",
      "permission_classes",
      "IsAuthenticated",
      "TokenAuthentication",
      "object permissions",
    ],
    intent: "Checks API access control.",
    short:
      "Authentication identifies who is making the request, and permissions decide whether they may do it. DRF has authentication classes such as `SessionAuthentication` (for browser clients using cookies) and `TokenAuthentication`; others come from third-party packages. Permission classes run after authentication: `IsAuthenticated`, `IsAdminUser`, `IsAuthenticatedOrReadOnly`, `DjangoModelPermissions`, or your own subclass of `BasePermission` implementing `has_permission()` for view-level checks and `has_object_permission()` for per-object ones. Set defaults in `REST_FRAMEWORK` settings and override per view with `permission_classes`. A failed authentication gives 401 or 403 depending on the scheme.",
    detail: [
      "Object-level permissions are checked when you call `get_object()`.",
      "Be explicit: relying on the default 'allow any' is risky.",
      "Filter querysets by owner as well as checking permissions.",
    ],
    ex: "A custom `IsOwner` permission allowing only a note's author to edit it.",
    code: [
      [
        "Custom permission",
        "python",
        `from rest_framework import permissions\n\nclass IsOwner(permissions.BasePermission):\n    def has_object_permission(self, request, view, obj):\n        return obj.owner == request.user\n\nclass NoteViewSet(viewsets.ModelViewSet):\n    permission_classes = [permissions.IsAuthenticated, IsOwner]`,
        ["Authenticated users only, and only owners for object access."],
      ],
    ],
    mistakes: [
      "Leaving the default permission open.",
      "Checking permissions but returning other users' data in lists.",
    ],
    follow: [
      "What is the difference between has_permission and has_object_permission?",
    ],
    points: [
      "Authentication = who",
      "Permission = allowed or not",
      "has_permission and has_object_permission",
      "Set defaults in settings",
    ],
    notes: ["Identify, then authorise."],
    src: [
      ["DRF: Authentication", `${R}/api-guide/authentication/`],
      ["DRF: Permissions", `${R}/api-guide/permissions/`],
    ],
  }),
  q({
    slug: "drf-pagination-filtering-throttling",
    topic: "DRF",
    d: "medium",
    title: "How do you add pagination, filtering and throttling to a DRF API?",
    kw: [
      "drf pagination",
      "PageNumberPagination",
      "SearchFilter",
      "OrderingFilter",
      "throttle",
    ],
    intent: "Checks production-readiness features of an API.",
    short:
      "Pagination limits the size of list responses: set `DEFAULT_PAGINATION_CLASS` and `PAGE_SIZE`, using `PageNumberPagination`, `LimitOffsetPagination` or `CursorPagination` (stable for large, changing datasets). Filtering is added with `filter_backends`: built-in `SearchFilter` and `OrderingFilter` handle `?search=` and `?ordering=`, and the separate django-filter package adds field filters. Throttling limits request rates with `AnonRateThrottle` and `UserRateThrottle`, configured through `DEFAULT_THROTTLE_CLASSES` and `DEFAULT_THROTTLE_RATES`, for example `'user': '1000/day'`. Together they protect the server and clients from huge responses and abuse.",
    detail: [
      "Throttles use the cache backend to count requests.",
      "Always paginate list endpoints that could grow.",
      "Whitelist fields allowed for ordering and filtering.",
    ],
    ex: "`GET /books/?search=dune&ordering=-year&page=2`.",
    mistakes: [
      "Returning unbounded lists.",
      "Leaving search and ordering open to every field.",
    ],
    follow: ["Which pagination style suits constantly changing data?"],
    points: [
      "Set pagination class and page size",
      "SearchFilter and OrderingFilter",
      "Throttle classes and rates",
      "CursorPagination for stability",
    ],
    notes: ["Limit size, search, rate."],
    src: [
      ["DRF: Pagination", `${R}/api-guide/pagination/`],
      ["DRF: Throttling", `${R}/api-guide/throttling/`],
      ["DRF: Filtering", `${R}/api-guide/filtering/`],
    ],
  }),
  q({
    slug: "drf-nested-serializers-and-writes",
    topic: "DRF",
    d: "hard",
    title:
      "How do nested serializers work, and why are nested writes not automatic?",
    kw: [
      "nested serializer",
      "writable nested",
      "create override",
      "SerializerMethodField",
      "PrimaryKeyRelatedField",
    ],
    intent: "Checks handling of related data in DRF.",
    short:
      "A serializer field can itself be a serializer, so an order can include its items as nested objects (`items = ItemSerializer(many=True)`). Reading works automatically. Writing does not: DRF does not guess how to create or update related objects, so `ModelSerializer.create()` asserts if validated data contains nested data. You override `create()` and `update()` to pop the nested data, create the parent, then create the children, ideally inside a transaction. For simpler APIs, represent relations by id with `PrimaryKeyRelatedField` or by URL, and let clients create related objects with separate requests. Prefetch related data in the view to avoid N+1 queries when serialising nested objects.",
    detail: [
      "`read_only=True` on the nested serializer avoids the writing problem.",
      "Use `select_related` and `prefetch_related` in `get_queryset`.",
      "Deeply nested writes are hard to validate; consider flatter designs.",
    ],
    ex: "Creating an order and its line items in one POST by overriding `create()`.",
    code: [
      [
        "Nested create",
        "python",
        `class OrderSerializer(serializers.ModelSerializer):\n    items = ItemSerializer(many=True)\n\n    class Meta:\n        model = Order\n        fields = ["id", "items"]\n\n    def create(self, validated_data):\n        items = validated_data.pop("items")\n        order = Order.objects.create(**validated_data)\n        for item in items:\n            Item.objects.create(order=order, **item)\n        return order`,
        [
          "The nested data is removed first.",
          "Children are created after the parent.",
        ],
      ],
    ],
    mistakes: [
      "Expecting nested data to save automatically.",
      "Not using a transaction for multi-object writes.",
    ],
    follow: ["What does the default create() do with nested data?"],
    points: [
      "Nested serializers read automatically",
      "Writes need custom create/update",
      "Use a transaction",
      "Prefetch to avoid N+1",
    ],
    notes: ["Nested reads easy, nested writes explicit."],
    src: [
      [
        "DRF: Serializers (writable nested serializers)",
        `${R}/api-guide/serializers/`,
      ],
      ["DRF: Serializer relations", `${R}/api-guide/relations/`],
    ],
  }),
  q({
    slug: "project-versus-app-structure",
    topic: "Project structure & settings",
    d: "easy",
    title:
      "What is the difference between a Django project and an app, and how are they laid out?",
    kw: [
      "django project",
      "django app",
      "startproject",
      "startapp",
      "INSTALLED_APPS",
    ],
    intent: "Checks the basic structure of a Django codebase.",
    short:
      "A project is the whole site configuration created by `django-admin startproject`: `manage.py`, a package with `settings.py`, the root `urls.py` and `wsgi.py`/`asgi.py` entry points. An app is a self-contained module providing one feature, created with `python manage.py startapp blog`, containing `models.py`, `views.py`, `admin.py`, `apps.py`, `migrations/` and tests. A project contains many apps, and an app can be reused in several projects. An app takes effect only when it is added to `INSTALLED_APPS`. Keep apps focused on one responsibility, with the project package holding only configuration and wiring.",
    detail: [
      "`manage.py` runs commands like `runserver`, `migrate` and `test`.",
      "Apps have their own URLconf included by the project's root URLconf.",
      "Apps are Python packages, so keep names unique and importable.",
    ],
    ex: "An e-commerce project with `catalog`, `orders` and `accounts` apps.",
    mistakes: [
      "One giant app for everything.",
      "Forgetting to add the app to INSTALLED_APPS.",
    ],
    follow: ["Where do you register a new app?"],
    points: [
      "Project = configuration",
      "App = one feature",
      "INSTALLED_APPS activates apps",
      "manage.py runs commands",
    ],
    notes: ["Project holds apps."],
    src: [
      [
        "Django: Writing your first Django app, part 1",
        `${D}/intro/tutorial01/`,
      ],
      ["Django: Applications", `${D}/ref/applications/`],
    ],
  }),
  q({
    slug: "settings-secrets-and-environments",
    topic: "Project structure & settings",
    d: "medium",
    title:
      "How should you manage Django settings and secrets across environments?",
    kw: [
      "django settings",
      "SECRET_KEY",
      "environment variables",
      "DEBUG",
      "ALLOWED_HOSTS",
    ],
    intent: "Checks safe configuration practice.",
    short:
      "Settings differ between development and production, and secrets must not be committed. Read sensitive and environment-specific values such as `SECRET_KEY`, database credentials and `DEBUG` from environment variables (or a secrets manager), either directly with `os.environ` or via a helper library. In production `DEBUG` must be `False`, because debug mode shows detailed error pages that leak settings; with `DEBUG = False` you must also set `ALLOWED_HOSTS`. Keep the `SECRET_KEY` secret, since it signs sessions and tokens. Split settings into a shared base and per-environment modules if they diverge, and run `python manage.py check --deploy` to find insecure values.",
    detail: [
      "Rotate a leaked secret key immediately.",
      "Use separate databases and keys per environment.",
      "Never commit `.env` files with real secrets.",
    ],
    ex: "`DEBUG = os.environ.get('DJANGO_DEBUG') == '1'` so production defaults to off.",
    code: [
      [
        "Reading settings from the environment",
        "python",
        `import os\n\nSECRET_KEY = os.environ["DJANGO_SECRET_KEY"]      # fail if missing\nDEBUG = os.environ.get("DJANGO_DEBUG") == "1"       # off by default\nALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(",")`,
        [
          "Production is the safe default.",
          "Missing secrets stop the app at startup.",
        ],
      ],
    ],
    mistakes: [
      "Committing SECRET_KEY.",
      "Running with DEBUG=True in production.",
    ],
    follow: ["What does check --deploy do?"],
    points: [
      "Secrets from the environment",
      "DEBUG off in production",
      "ALLOWED_HOSTS required",
      "check --deploy",
    ],
    notes: ["Config in the environment."],
    src: [
      ["Django: Settings", `${D}/topics/settings/`],
      ["Django: Deployment checklist", `${D}/howto/deployment/checklist/`],
    ],
  }),
  q({
    slug: "deployment-checklist-and-static-files",
    topic: "Project structure & settings",
    d: "medium",
    title:
      "What must you do to prepare a Django project for production, including static files?",
    kw: [
      "deployment checklist",
      "collectstatic",
      "STATIC_ROOT",
      "gunicorn",
      "https settings",
    ],
    intent: "Checks production readiness.",
    short:
      "Run `python manage.py check --deploy` and follow the deployment checklist: set `DEBUG = False`, keep `SECRET_KEY` secret, set `ALLOWED_HOSTS`, enable HTTPS-related settings (`SECURE_SSL_REDIRECT`, secure cookies, HSTS), configure a production database and logging. Do not use `runserver`; serve the app with a WSGI or ASGI server such as Gunicorn or Uvicorn behind a reverse proxy like Nginx. Static files (CSS, JS) are collected into `STATIC_ROOT` with `collectstatic` and served by the web server, a CDN or a static-file middleware, because Django does not serve them in production. User uploads (`MEDIA_ROOT`) need separate storage.",
    detail: [
      "Run migrations as part of the release process.",
      "Set up error reporting and backups.",
      "Hashed static filenames (`ManifestStaticFilesStorage`) help cache busting.",
    ],
    ex: "A Docker image runs `collectstatic` at build time and Gunicorn at start.",
    mistakes: [
      "Serving static files with runserver in production.",
      "Skipping check --deploy.",
    ],
    follow: ["Where do collected static files go?"],
    points: [
      "check --deploy and the checklist",
      "WSGI/ASGI server behind a proxy",
      "collectstatic into STATIC_ROOT",
      "HTTPS and secure cookies",
    ],
    notes: ["Not runserver, not DEBUG."],
    src: [
      ["Django: Deployment checklist", `${D}/howto/deployment/checklist/`],
      ["Django: Managing static files", `${D}/howto/static-files/`],
    ],
  }),
  q({
    slug: "custom-user-model-and-auth-basics",
    topic: "Auth & admin",
    d: "medium",
    title:
      "How does Django authentication work, and why set a custom user model early?",
    kw: [
      "django auth",
      "AbstractUser",
      "AUTH_USER_MODEL",
      "get_user_model",
      "login logout",
    ],
    intent: "Checks the authentication framework and a key decision.",
    short:
      "`django.contrib.auth` provides users, password hashing, groups, permissions, sessions-based login and views for login and logout. `authenticate(request, username=..., password=...)` verifies credentials and `login(request, user)` stores the user in the session; `request.user` is then available in views and templates. Django's documentation strongly recommends defining a custom user model at the start of a new project, even if the default is enough: subclass `AbstractUser` (or `AbstractBaseUser`), point `AUTH_USER_MODEL` at it, and refer to it with `get_user_model()` or `settings.AUTH_USER_MODEL`, because switching later is difficult once migrations and foreign keys exist.",
    detail: [
      "Use `email` as the login field by customising the model and manager.",
      "Never import `User` directly when you can use `get_user_model()`.",
      "Third-party apps for social login build on the same framework.",
    ],
    ex: "A project that wants to log in with email creates `accounts.User(AbstractUser)` before the first migration.",
    mistakes: [
      "Starting with the default User and changing later.",
      "Importing django.contrib.auth.models.User in reusable code.",
    ],
    follow: ["Where do you reference the user model in a ForeignKey?"],
    points: [
      "authenticate then login",
      "request.user",
      "Custom user model from day one",
      "AUTH_USER_MODEL and get_user_model",
    ],
    notes: ["Decide the user model first."],
    src: [
      ["Django: Customizing authentication", `${D}/topics/auth/customizing/`],
      ["Django: Using the authentication system", `${D}/topics/auth/default/`],
    ],
  }),
  q({
    slug: "permissions-groups-and-login-required",
    topic: "Auth & admin",
    d: "medium",
    title:
      "How do you restrict access to views by login, permissions and groups?",
    kw: [
      "login_required",
      "permission_required",
      "LoginRequiredMixin",
      "has_perm",
      "groups",
    ],
    intent: "Checks access control in views.",
    short:
      "For function-based views use the `@login_required` decorator, which redirects anonymous users to `LOGIN_URL`, and `@permission_required('app.change_book')` to require a specific permission. For class-based views use `LoginRequiredMixin` and `PermissionRequiredMixin`, placed first in the inheritance list. Django creates add, change, delete and view permissions for every model; users get them directly or through groups, and you check with `user.has_perm('app.change_book')`. In templates, `perms.app.change_book` works too. Superusers have all permissions. Also filter querysets by owner when users should only see their own records, because permissions apply per model, not per row, unless you add object-level checks.",
    detail: [
      "Return 403 for authenticated but unauthorised users via `raise_exception=True`.",
      "Check permissions on the server, not only by hiding buttons.",
      "Third-party packages add object-level permissions.",
    ],
    ex: "Only members of an 'editors' group with `change_article` can edit articles.",
    code: [
      [
        "Access control",
        "python",
        `from django.contrib.auth.decorators import login_required, permission_required\nfrom django.contrib.auth.mixins import PermissionRequiredMixin\n\n@login_required\ndef profile(request): ...\n\n@permission_required("blog.change_post", raise_exception=True)\ndef edit(request, pk): ...\n\nclass PostUpdate(PermissionRequiredMixin, UpdateView):\n    permission_required = "blog.change_post"`,
        ["The decorator and mixin enforce the same rule."],
      ],
    ],
    mistakes: [
      "Hiding links instead of enforcing on the server.",
      "Assuming model permissions restrict individual rows.",
    ],
    follow: ["Which permissions does Django create for each model?"],
    points: [
      "login_required / LoginRequiredMixin",
      "permission_required",
      "Default model permissions",
      "Filter by owner for row-level access",
    ],
    notes: ["Enforce on the server."],
    src: [
      [
        "Django: Using the authentication system (permissions)",
        `${D}/topics/auth/default/`,
      ],
      [
        "Django: Authentication decorators and mixins",
        `${D}/topics/auth/default/`,
      ],
    ],
  }),
  q({
    slug: "password-storage-in-django",
    topic: "Auth & admin",
    d: "medium",
    title: "How does Django store passwords?",
    kw: [
      "password hashing",
      "PBKDF2",
      "make_password",
      "check_password",
      "password validators",
    ],
    intent: "Checks secure credential storage.",
    short:
      "Django never stores plain-text passwords. It stores a salted hash produced by a slow, deliberately expensive hashing algorithm; by default PBKDF2 with a SHA256 hash, with other hashers such as Argon2 and bcrypt available through `PASSWORD_HASHERS`. The stored string contains the algorithm, iteration count, salt and hash, so the settings can be upgraded: when a user logs in with an older hash, Django can rehash the password with the preferred algorithm. Use `user.set_password()`, `make_password()` and `check_password()` rather than handling hashes yourself, and enable `AUTH_PASSWORD_VALIDATORS` to reject weak passwords. Never log or email passwords.",
    detail: [
      "Hashing is one-way: you cannot recover a password, only reset it.",
      "Salting makes identical passwords produce different hashes.",
      "Increase work factors over time as hardware improves.",
    ],
    ex: "A leaked database table exposes only salted hashes, not the passwords.",
    mistakes: [
      "Writing passwords directly to the field.",
      "Using fast hashes like plain SHA-256 for passwords.",
    ],
    follow: ["How are old hashes upgraded?"],
    points: [
      "Salted slow hashes",
      "PBKDF2 by default",
      "set_password and check_password",
      "Password validators",
    ],
    notes: ["Hash, salt, never store."],
    src: [
      ["Django: Password management", `${D}/topics/auth/passwords/`],
      ["Django: Security overview", `${D}/topics/security/`],
    ],
  }),
  q({
    slug: "django-admin-customization",
    topic: "Auth & admin",
    d: "easy",
    title: "What is the Django admin, and how do you customise it?",
    kw: [
      "django admin",
      "ModelAdmin",
      "list_display",
      "search_fields",
      "createsuperuser",
    ],
    intent: "Checks use of the built-in admin site.",
    short:
      "The admin is an automatically generated interface for managing your data. Create an admin user with `python manage.py createsuperuser`, then register models in `admin.py` with `admin.site.register(Book)` or the `@admin.register(Book)` decorator on a `ModelAdmin` subclass. `ModelAdmin` options shape the screens: `list_display` for columns, `list_filter` for sidebar filters, `search_fields` for the search box, `readonly_fields`, `ordering` and `inlines` to edit related objects on the same page. The documentation notes that the admin is meant as an internal management tool for trusted staff, not as the public front end of an application.",
    detail: [
      "Custom actions apply operations to selected rows.",
      "Restrict staff access with permissions, since admin users can change data.",
      "Large tables need `list_select_related` and indexes to keep the admin fast.",
    ],
    ex: "A support team uses the admin to search orders by email and update their status.",
    code: [
      [
        "ModelAdmin",
        "python",
        `from django.contrib import admin\n\n@admin.register(Book)\nclass BookAdmin(admin.ModelAdmin):\n    list_display = ["title", "author", "year"]\n    list_filter = ["year"]\n    search_fields = ["title", "author__name"]`,
        ["Columns, filters and search come from class options."],
      ],
    ],
    mistakes: [
      "Exposing the admin to the public without protection.",
      "Giving every staff user full permissions.",
    ],
    follow: ["Which options control the list page?"],
    points: [
      "createsuperuser",
      "Register with ModelAdmin",
      "list_display, list_filter, search_fields",
      "Internal tool for trusted users",
    ],
    notes: ["Free back office."],
    src: [
      ["Django: The Django admin site", `${D}/ref/contrib/admin/`],
      [
        "Django: Writing your first Django app, part 2 (admin)",
        `${D}/intro/tutorial02/`,
      ],
    ],
  }),
  q({
    slug: "testing-django-applications",
    topic: "Project structure & settings",
    d: "medium",
    title: "How do you test a Django application?",
    kw: [
      "django testing",
      "TestCase",
      "test client",
      "assertNumQueries",
      "manage.py test",
    ],
    intent: "Checks testing practice with Django's tools.",
    short:
      "Django ships a test framework built on `unittest`. Write test classes that extend `django.test.TestCase`, which wraps each test in a transaction rolled back afterwards, so tests are isolated and fast, and run them with `python manage.py test` against a separate test database. The test `Client` makes requests to your views without a real server (`self.client.get('/books/')`) and lets you log in with `client.force_login(user)`; `RequestFactory` builds requests for testing views directly. Useful assertions include `assertEqual(response.status_code, 200)`, `assertContains`, `assertRedirects` and `assertNumQueries`. Use `TransactionTestCase` only when you need real commits, and create test data in `setUpTestData`.",
    detail: [
      "Factories (for example factory_boy) reduce setup code.",
      "Use `override_settings` to change settings in a test.",
      "Mock external services; never call real APIs in unit tests.",
    ],
    ex: "A test that logs in, posts a form and checks that a new record exists.",
    code: [
      [
        "A view test",
        "python",
        `from django.test import TestCase\nfrom django.urls import reverse\n\nclass BookListTests(TestCase):\n    @classmethod\n    def setUpTestData(cls):\n        Book.objects.create(title="Dune", year=1965)\n\n    def test_list_shows_books(self):\n        response = self.client.get(reverse("book-list"))\n        self.assertEqual(response.status_code, 200)\n        self.assertContains(response, "Dune")`,
        [
          "Data is created once per class.",
          "The client calls the view without a server.",
        ],
      ],
    ],
    mistakes: [
      "Sharing state between tests.",
      "Hitting real external services.",
    ],
    follow: ["Why does TestCase roll back each test?"],
    points: [
      "TestCase wraps tests in transactions",
      "Client simulates requests",
      "assertContains, assertRedirects, assertNumQueries",
      "Separate test database",
    ],
    notes: ["Isolated, fast tests."],
    src: [
      ["Django: Testing in Django", `${D}/topics/testing/overview/`],
      ["Django: Testing tools", `${D}/topics/testing/tools/`],
    ],
  }),
  q({
    slug: "django-built-in-security-features",
    topic: "Project structure & settings",
    d: "medium",
    title: "Which security protections does Django provide out of the box?",
    kw: [
      "django security",
      "sql injection",
      "xss",
      "clickjacking",
      "https settings",
    ],
    intent: "Checks awareness of defences and their limits.",
    short:
      "Django's ORM uses parameterised queries, protecting against SQL injection when you use it normally; templates escape output to protect against XSS; `CsrfViewMiddleware` protects forms against CSRF; `XFrameOptionsMiddleware` sets `X-Frame-Options` to prevent clickjacking; and host header validation uses `ALLOWED_HOSTS`. Passwords are hashed with a slow algorithm. For HTTPS, settings such as `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE` and `SECURE_HSTS_SECONDS` help. These defences can be bypassed by misuse: raw SQL with string formatting, `|safe` on user input, `csrf_exempt` everywhere or `DEBUG = True` in production. `check --deploy` highlights missing protections.",
    detail: [
      "Keep Django and dependencies updated for security releases.",
      "Validate file uploads and serve user media from a separate domain or storage.",
      "Security is layered: add rate limiting, logging and monitoring.",
    ],
    ex: "A project passes `check --deploy` after enabling secure cookies, HSTS and an HTTPS redirect.",
    mistakes: [
      "Disabling protections to make something work.",
      "Falling behind on security updates.",
    ],
    follow: ["How can the ORM still be misused to allow SQL injection?"],
    points: [
      "Parameterised ORM queries",
      "Template autoescaping",
      "CSRF and clickjacking middleware",
      "HTTPS-related settings",
    ],
    notes: ["Defaults help, misuse breaks them."],
    src: [
      ["Django: Security in Django", `${D}/topics/security/`],
      ["Django: Deployment checklist", `${D}/howto/deployment/checklist/`],
    ],
  }),
  q({
    slug: "signals-versus-overriding-save",
    topic: "ORM",
    d: "medium",
    title: "When should you use Django signals, and what are their drawbacks?",
    kw: [
      "django signals",
      "post_save",
      "receiver",
      "override save",
      "side effects",
    ],
    intent: "Checks judgement about hidden control flow.",
    short:
      "Signals let one part of the code be notified when something happens elsewhere, for example `post_save` after a model is saved. You connect a function with the `@receiver(post_save, sender=Order)` decorator. They are useful for decoupled reactions across apps, such as creating a profile when a user is created or invalidating a cache. The drawbacks are hidden, implicit behaviour that is hard to trace, ordering problems, and the fact that bulk operations (`bulk_create`, `update()`) do not send them. For logic that belongs to the model itself, override `save()` or put it in a service function that is called explicitly; and use `transaction.on_commit` for side effects.",
    detail: [
      "Register signal handlers in `AppConfig.ready()`.",
      "Keep handlers short and idempotent.",
      "Prefer explicit calls for anything that is core to the business flow.",
    ],
    ex: "A `post_save` handler on the user model that creates a related profile.",
    code: [
      [
        "Receiver",
        "python",
        `from django.db.models.signals import post_save\nfrom django.dispatch import receiver\n\n@receiver(post_save, sender=User)\ndef create_profile(sender, instance, created, **kwargs):\n    if created:\n        Profile.objects.create(user=instance)`,
        ["Runs after each User save.", "Not triggered by bulk_create."],
      ],
    ],
    mistakes: [
      "Hiding core business logic in signals.",
      "Assuming bulk operations trigger signals.",
    ],
    follow: ["Where should signal handlers be imported?"],
    points: [
      "Notify on events",
      "Decoupled but implicit",
      "Not sent by bulk methods",
      "Prefer explicit calls for core logic",
    ],
    notes: ["Convenient, but hidden."],
    src: [
      ["Django: Signals", `${D}/topics/signals/`],
      ["Django: Model instance reference (save)", `${D}/ref/models/instances/`],
    ],
  }),
])
