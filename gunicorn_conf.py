import os
import multiprocessing

# Workers: use env GUNICORN_WORKERS or 2*CPU+1, capped to a reasonable maximum
cpu = multiprocessing.cpu_count()
default_workers = (cpu * 2) + 1
workers_env = os.environ.get('GUNICORN_WORKERS')
if workers_env:
    try:
        workers = int(workers_env)
    except ValueError:
        workers = default_workers
else:
    workers = default_workers
# cap workers to avoid runaway in some environments
MAX_WORKERS = int(os.environ.get('GUNICORN_MAX_WORKERS', 8))
if workers > MAX_WORKERS:
    workers = MAX_WORKERS

bind = '0.0.0.0:5000'
worker_class = 'sync'
accesslog = '-'  # stdout
errorlog = '-'
