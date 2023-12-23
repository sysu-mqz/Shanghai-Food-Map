export default "@export ecgl.color.vertex\n\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\n\n@import ecgl.common.uv.header\n\nattribute vec2 texcoord : TEXCOORD_0;\nattribute vec3 position: POSITION;\n\n@import ecgl.common.wireframe.vertexHeader\n\n#ifdef VERTEX_COLOR\nattribute vec4 a_Color : COLOR;\nvarying vec4 v_Color;\n#endif\n\n#ifdef VERTEX_ANIMATION\nattribute vec3 prevPosition;\nuniform float percent : 1.0;\n#endif\n\n#ifdef ATMOSPHERE_ENABLED\nattribute vec3 normal: NORMAL;\nuniform mat4 worldInverseTranspose : WORLDINVERSETRANSPOSE;\nvarying vec3 v_Normal;\n#endif\n\nvoid main()\n{\n#ifdef VERTEX_ANIMATION\n vec3 pos = mix(prevPosition, position, percent);\n#else\n vec3 pos = position;\n#endif\n\n gl_Position = worldViewProjection * vec4(pos, 1.0);\n\n @import ecgl.common.uv.main\n\n#ifdef VERTEX_COLOR\n v_Color = a_Color;\n#endif\n\n#ifdef ATMOSPHERE_ENABLED\n v_Normal = normalize((worldInverseTranspose * vec4(normal, 0.0)).xyz);\n#endif\n\n @import ecgl.common.wireframe.vertexMain\n\n}\n\n@end\n\n@export ecgl.color.fragment\n\n#define LAYER_DIFFUSEMAP_COUNT 0\n#define LAYER_EMISSIVEMAP_COUNT 0\n\nuniform sampler2D diffuseMap;\nuniform sampler2D detailMap;\n\nuniform vec4 color : [1.0, 1.0, 1.0, 1.0];\n\n#ifdef ATMOSPHERE_ENABLED\nuniform mat4 viewTranspose: VIEWTRANSPOSE;\nuniform vec3 glowColor;\nuniform float glowPower;\nvarying vec3 v_Normal;\n#endif\n\n#ifdef VERTEX_COLOR\nvarying vec4 v_Color;\n#endif\n\n@import ecgl.common.layers.header\n\n@import ecgl.common.uv.fragmentHeader\n\n@import ecgl.common.wireframe.fragmentHeader\n\n@import clay.util.srgb\n\nvoid main()\n{\n#ifdef SRGB_DECODE\n gl_FragColor = sRGBToLinear(color);\n#else\n gl_FragColor = color;\n#endif\n\n#ifdef VERTEX_COLOR\n gl_FragColor *= v_Color;\n#endif\n\n @import ecgl.common.albedo.main\n\n @import ecgl.common.diffuseLayer.main\n\n gl_FragColor *= albedoTexel;\n\n#ifdef ATMOSPHERE_ENABLED\n float atmoIntensity = pow(1.0 - dot(v_Normal, (viewTranspose * vec4(0.0, 0.0, 1.0, 0.0)).xyz), glowPower);\n gl_FragColor.rgb += glowColor * atmoIntensity;\n#endif\n\n @import ecgl.common.emissiveLayer.main\n\n @import ecgl.common.wireframe.fragmentMain\n\n}\n@end";