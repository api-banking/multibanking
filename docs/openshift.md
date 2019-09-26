# Openshift setup

- oc login
- oc edit buildConfig/multibanking

```yaml
# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file will be
# reopened with the relevant failures.
#
apiVersion: v1
kind: BuildConfig
metadata:
  annotations:
    openshift.io/generated-by: OpenShiftNewApp
  creationTimestamp: 2019-02-14T14:31:23Z
  labels:
    app: multibanking
  name: multibanking
  namespace: fintech-sandbox-playground
  resourceVersion: '87774752'
  selfLink: /oapi/v1/namespaces/fintech-sandbox-playground/buildconfigs/multibanking
  uid: 33fedbdd-3065-11e9-ae3c-005056937133
spec:
  nodeSelector: null
  output:
    to:
      kind: ImageStreamTag
      name: multibanking:latest
  postCommit: {}
  resources:
    limits:
      memory: 3Gi
  runPolicy: Serial
  source:
    git:
      uri: https://gitlab-ci-token:PA7VQtTFT_iUFsPKM9Pu@gitlab.vs.csin.cz/multibanking/mutlibanking.git
    type: Git
  strategy:
    sourceStrategy:
      env:
        - name: npm_config_registry
          value: http://sdf.csin.cz/artifactory/api/npm/npm-virtual
        - name: NODE_ENV
          value: uat
      from:
        kind: ImageStreamTag
        name: nodejs:latest
        namespace: openshift
    type: Source
  triggers:
    - github:
        secret: ulMcsXTeKYZseobUI22g
      type: GitHub
    - generic:
        secret: 1SZ1ZPlcecjtm3L4fEII
      type: Generic
    - type: ConfigChange
    - imageChange:
        lastTriggeredImageID: docker-registry-default.rocp.vs.csin.cz/rhscl/nodejs-6-rhel7@sha256:71664e143be96ba62e595cf9901ad78a76771872d67e7996ced791307b65ed17
      type: ImageChange
status:
  lastVersion: 99
```
