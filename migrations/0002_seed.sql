INSERT OR IGNORE INTO products (
  id, slug, title, description, category, price_cents, file_key, file_name, file_size, image_url, stock, published
) VALUES
(
  'prd_frame_jig_v1',
  'pyre-frame-jig-v1',
  'Pyre Frame Jig v1',
  'Printable jig reference files for personal fabrication in Pennsylvania. Includes build notes and bill of materials. Free download for personal use.',
  'file',
  0,
  NULL,
  'pyre-frame-jig-v1.zip',
  NULL,
  NULL,
  NULL,
  1
),
(
  'prd_ember_lower_stl',
  'ember-lower-stl',
  'Ember Lower — STL Pack',
  'STL pack oriented for common FDM setups. Includes recommended settings sheet. Not for commercial manufacture or sale.',
  'file',
  0,
  NULL,
  'ember-lower-stl.zip',
  NULL,
  NULL,
  NULL,
  1
),
(
  'prd_forge_parts_kit',
  'forge-parts-kit',
  'Forge Parts Kit',
  'Hardware and finishing parts kit to complement your personal build. Ships within the contiguous US where lawful. You print the polymer; we ship the metal.',
  'kit',
  18900,
  NULL,
  NULL,
  NULL,
  NULL,
  25,
  1
),
(
  'prd_ember_completion_kit',
  'ember-completion-kit',
  'Ember Completion Kit',
  'Curated small-parts kit: pins, springs, and fasteners matched to Ember Lower files. Fulfillment after purchase confirmation.',
  'kit',
  7900,
  NULL,
  NULL,
  NULL,
  NULL,
  40,
  1
);
